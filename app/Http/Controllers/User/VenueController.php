<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\SlotStatusLabel;
use App\Http\Controllers\User\Controller;
use Illuminate\Pagination\LengthAwarePaginator;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::with(['fields.timeSlots', 'featuredImage', 'addresses.village', 'addresses.district', 'addresses.city', 'addresses.province'])
            ->paginate(15)
            ->withQueryString();

        $currentPage = $venues->currentPage();
        $perPage = $venues->perPage();

            $transformedCollection = $venues->getCollection()->map(function ($venue, $index) use ($currentPage, $perPage) {
            $allPrices = [];

            foreach ($venue->fields as $field) {
                foreach ($field->timeSlots as $timeSlot) {
                    if (isset($timeSlot->pivot->price)) {
                        $allPrices[] = $timeSlot->pivot->price;
                    }
                }
            }

            $minPrice = count($allPrices) > 0 ? min($allPrices) : 0;

            // Ambil gambar featured, jika ada, buat url lengkapnya
            $image = $venue->featuredImage
                ? asset('storage/' . $venue->featuredImage->image_path)
                : null;

            $address = $venue->addresses->first();

            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $venue->id,
                'slug' => $venue->slug,
                'name' => $venue->name,
                'phone_number' => $venue->phone_number,
                'fields' => $venue->fields->pluck('name')->join(', '),
                'updated_at' => optional($venue->updated_at)->format('d M Y'),
                'min_price' => $minPrice,
                'image' => $venue->featuredImage
                    ? asset('storage/' . $venue->featuredImage->image_path)
                    : asset('/assets/images/field-default.jpg'),
                'address' => [
                    'district' => $address?->district?->name, // 👈 langsung ambil district
                    'city' => $address?->city?->name, // 👈 langsung ambil district
                ],
            ];
        });


        $paginatedVenues = new LengthAwarePaginator(
            $transformedCollection,
            $venues->total(),
            $perPage,
            $currentPage,
            [
                'path' => $venues->path(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render('Venue', [
            'venues' => $paginatedVenues,
        ]);
    }

    public function show(Request $request, Venue $venue) 
    {
        // Load relasi yang sifatnya statis
        $venue->load([
            'images',
            'facilities',
            'fields.type',
            'fields.featuredImage',
            'fields.timeSlots',
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
        ]);

        // Ambil harga minimal dari seluruh field
        $allPrices = collect();
        foreach ($venue->fields as $field) {
            foreach ($field->timeSlots as $ts) {
                if ($ts->pivot->price !== null) {
                    $allPrices->push($ts->pivot->price);
                }
            }
        }
        $minPrice = $allPrices->count() > 0 ? $allPrices->min() : 0;

        // Return hanya data statis venue
        return Inertia::render('VenueDetail', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'description' => $venue->description,
                'phone_number' => $venue->phone_number,
                'facilities' => $venue->facilities->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'icon' => $f->icon,
                ]),
                'min_price' => $minPrice,
                'fields' => $venue->fields->map(function ($field) {
                    return [
                        'id' => $field->id,
                        'name' => $field->name,
                        'type' => $field->type->name ?? '-',
                        'description' => $field->description,
                        'image' => $field->featuredImage 
                            ? asset('storage/' . $field->featuredImage->image_path) 
                            : asset('/assets/images/field-default.jpg'),
                    ];
                }),
                'images' => $venue->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => asset('storage/' . $img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]),
                'slug' => $venue->slug,
                'address' => $venue->addresses->map(fn($addr) => [
                    'full_address' => $addr->address,
                    'province' => $addr->province?->name,
                    'city' => $addr->city?->name,
                    'district' => $addr->district?->name,
                    'village' => $addr->village?->name,
                    'postal_code' => $addr->postal_code,
                    'latitude' => $addr->latitude,
                    'longitude' => $addr->longitude,
                    'type' => $addr->type,
                ])->first(),
            ],
        ]);
    }


}
