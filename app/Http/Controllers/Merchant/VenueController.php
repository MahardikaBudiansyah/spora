<?php

namespace App\Http\Controllers\Merchant;

use Log;
use Inertia\Inertia;
use App\Models\Venue;
use App\Models\Facility;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Merchant\Controller;

class VenueController extends Controller
{

    public function __construct()
    {
        $this->authorizeResource(Venue::class, 'venue');
    }
        
    public function index(Request $request)
    {
        $venues = Venue::with(['fields', 'addresses.district', 'addresses.city'])
            ->where('merchant_id', auth('merchant')->id())
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $venues->currentPage();
        $perPage = $venues->perPage();

        $venues->getCollection()->transform(function ($venue, $index) use ($currentPage, $perPage) {
            $address = $venue->addresses->first();
            $fullAddress = $address 
                ? ($address->district?->name ?? '') . ($address->city?->name ? ', ' . $address->city->name : '')
                : null;

            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $venue->id,
                'slug' => $venue->slug,
                'name' => $venue->name,
                'phone_number' => $venue->phone_number,
                'field' => $venue->fields->pluck('name')->toArray(),
                'address' => $fullAddress,
                'updated_at' => $venue->updated_at,
            ];
        });


        return Inertia::render('Merchant/Venue/Index', [
            'venues' => $venues,
        ]);
    }



    public function create()
    {
        $merchant = auth('merchant')->user();
        
        if ($merchant->status !== 'active') {
            return redirect()
                ->route('merchant.dashboard')
                ->with('error', 'Akun Anda masih dalam proses verifikasi. Silakan tunggu persetujuan dari admin.');
        }

        $facilities = Facility::orderBy('name')->get(['id', 'name', 'icon']);

        return Inertia::render('Merchant/Venue/Create', [
            'facilities' => $facilities,
            'address' => [
                'province_id' => null,
                'city_id' => null,
                'district_id' => null,
                'village_id' => null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'phone_number' => 'required|string',
            'facility' => 'array',
            'facility.*' => 'exists:facilities,id',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'main_image_index' => 'nullable|integer|min:0',
            'full_address' => 'nullable|string',
            'province_code' => 'nullable|exists:indonesia_provinces,code',
            'city_code' => 'nullable|exists:indonesia_cities,code',
            'district_code' => 'nullable|exists:indonesia_districts,code',
            'village_code' => 'nullable|exists:indonesia_villages,code',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // Buat venue dulu
        $venue = Venue::create([
            'merchant_id' => auth('merchant')->id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'phone_number' => $validated['phone_number'],
        ]);

        $venue->facilities()->sync($validated['facility'] ?? []);

        $venue->addresses()->create([
            'address'       => $validated['full_address'] ?? null,
            'province_code' => $validated['province_code'] ?? null,
            'city_code'     => $validated['city_code'] ?? null,
            'district_code' => $validated['district_code'] ?? null,
            'village_code'  => $validated['village_code'] ?? null,
            'postal_code'   => $validated['postal_code'] ?? null,
            'latitude'      => $validated['latitude'] ?? null,
            'longitude'     => $validated['longitude'] ?? null,
            'type'          => 'main',
        ]);

        if ($request->hasFile('images')) {
            $venueNameSlug = Str::slug($venue->name);
            $folderPath = "uploads/venues/{$venue->id}";
            $featuredIndex = intval($validated['main_image_index'] ?? 0);

            $uploadedImages = UploadImageHelper::handle(
                $request->file('images'),
                $folderPath,
                $venueNameSlug,
                $featuredIndex,
                $venue->id, 
            );

            $venue->images()->createMany($uploadedImages);
        }

        // Setelah membuat $venue
        $venue->paymentType()->create([
            'enable_dp'                 => false, // default DP tidak aktif
            'dp_type'                   => 'fixed', // default tipe DP
            'dp_value'                  => 0,       // default nilai DP
            'apply_to_merchant'         => false,
            'apply_to_merchant'         => false,
            'full_payment_days_before'  => 1,   // default H-1
            'max_full_payment_days'     => 3,   // maksimum H-3
            'is_active'                 => true,
        ]);


        return redirect()
        ->route('merchant.venues.index')
        ->with('success', 'Venue berhasil ditambahkan.');
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

        return Inertia::render('Merchant/Venue/Show', [
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


    public function edit(Venue $venue)
    {
        $venue->load([
            'facilities',
            'images' => fn ($q) => $q->orderBy('order'),
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
        ]);

        return Inertia::render('Merchant/Venue/Edit', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'description' => $venue->description,
                'phone_number' => $venue->phone_number,
                'facility' => $venue->facilities->pluck('id'),

                // address utama
                'address' => $venue->addresses->map(fn($addr) => [
                    'full_address' => $addr->address,
                    'province_code' => $addr->province_code,
                    'city_code' => $addr->city_code,
                    'district_code' => $addr->district_code,
                    'village_code' => $addr->village_code,
                    'postal_code' => $addr->postal_code,
                    'latitude' => $addr->latitude,
                    'longitude' => $addr->longitude,
                    'type' => $addr->type,
                ])->first(),

                // images
                'images' => $venue->images->map(function ($image) {
                    $image_path = $image->image_path;
                    $size = $image_path && Storage::disk('public')->exists($image_path)
                        ? Storage::disk('public')->size($image_path)
                        : 0;

                    return [
                        'id' => $image->id,
                        'url' => asset('storage/' . $image->image_path),
                        'name' => basename($image->image_path),
                        'size' => $size,
                        'is_featured' => $image->is_featured,
                        'order' => $image->order,
                    ];
                }),

                'slug' => $venue->slug,
            ],
            'facilities' => Facility::orderBy('name')->get(['id', 'name', 'icon']),
        ]);
    }


    public function update(Request $request, Venue $venue)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'phone_number' => 'required|string|max:20',
            'facility' => 'array',
            'facility.*' => 'exists:facilities,id',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_image_ids' => 'nullable|json',
            'main_image_index' => 'nullable|integer|min:0',
            'main_image_id' => 'nullable|integer',

            // address
            'full_address' => 'nullable|string',
            'province_code' => 'nullable|exists:indonesia_provinces,code',
            'city_code' => 'nullable|exists:indonesia_cities,code',
            'district_code' => 'nullable|exists:indonesia_districts,code',
            'village_code' => 'nullable|exists:indonesia_villages,code',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $venue->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
        ]);

        $venue->facilities()->sync($validated['facility'] ?? []);

        $venue->addresses()->updateOrCreate(
            ['type' => 'main'],
            [
                'address'       => $validated['full_address'] ?? null,
                'province_code' => $validated['province_code'] ?? null,
                'city_code'     => $validated['city_code'] ?? null,
                'district_code' => $validated['district_code'] ?? null,
                'village_code'  => $validated['village_code'] ?? null,
                'postal_code'   => $validated['postal_code'] ?? null,
                'latitude'      => $validated['latitude'] ?? null,
                'longitude'     => $validated['longitude'] ?? null,
                'type'          => 'main',
            ]
        );

        UploadImageHelper::syncImages($venue, $request, [
            'slug_name' => $validated['name'],
            'folder' => "uploads/venues"
        ]);

        return redirect()
            ->route('merchant.venues.index')
            ->with('success', 'Venue berhasil diperbarui');
    }



    public function destroy(Venue $venue)
    {
        $venue->load(['images', 'address']);

        // Hapus images fisik + record
        foreach ($venue->images as $image) {
            if (!empty($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        // Hapus address (jika ada)
        if ($venue->address) {
            $venue->address->delete();
        }

        // Hapus venue
        $venue->delete();

        return redirect()
            ->route('merchant.venues.index')
            ->with('success', 'Venue berhasil dihapus!');
    }



}
