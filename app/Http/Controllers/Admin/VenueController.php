<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class VenueController extends Controller
{
    public function index(Request $request)
    {
        $venues = Venue::withCount('fields')
            ->with('merchant', 'address.city')
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Venues/Index', [
            'venues' => $venues,
        ]);
    }

    public function toggleActive(Venue $venue, Request $request)
    {
        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $venue->is_active = $request->is_active;
        $venue->save();

        return back()->with('success', 'Status data Venue diperbarui.');
    }

    public function show(Venue $venue)
    {
        $venue->load([
            'fields.type',
            'fields.featuredImage',
            'images',
            'facilities',
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
        ]);

        return Inertia::render('Admin/Venues/Show', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'description' => $venue->description,
                'phone_number' => $venue->phone_number,

                // fasilitas
                'facilities' => $venue->facilities->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'icon' => $f->icon,
                ]),

                // lapangan
                'fields' => $venue->fields->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'slug' => $f->slug,
                    'type' => $f->type->name ?? '-',
                    'price' => $f->timeslots->min('pivot.price') ?? 0,
                    'image' => $f->featuredImage 
                        ? asset($f->featuredImage->image_path) 
                        : null,
                ]),

                // gambar venue
                'images' => $venue->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => asset('storage/' . $img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]),

                // alamat
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
                ])->first(), // kalau cuma ada 1 alamat utama
                            
                'slug' => $venue->slug,
                'created_at' => $venue->created_at->format('d M Y'),
                'updated_at' => $venue->updated_at->format('d M Y'),
            ],
        ]);
    }

    public function destroy(Venue $venue)
    {
        $venue->delete(); 

        return back()->with('success', 'Data Venue berhasil dihapus.');
    }


}