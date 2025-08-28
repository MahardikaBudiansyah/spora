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
        $this->authorize('viewAny', Venue::class);

        $venues = Venue::with('fields')
            ->where('merchant_id', auth('merchant')->id())
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $venues->currentPage();
        $perPage = $venues->perPage();

        $venues->getCollection()->transform(function ($venue, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $venue->id,
                'slug' => $venue->slug,
                'name' => $venue->name,
                'location' => $venue->location,
                'phone_number' => $venue->phone_number,
                'field' => $venue->fields->pluck('name')->join(', '),
                'updated_at' => $venue->updated_at->format('d M Y'),
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
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'location' => 'required|string',
            'phone_number' => 'required|string',
            'facility' => 'array',
            'facility.*' => 'exists:facilities,id',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'main_image_index' => 'nullable|integer|min:0',
        ]);

        // Buat venue dulu
        $venue = Venue::create([
            'merchant_id' => auth('merchant')->id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'],
            'phone_number' => $validated['phone_number'],
        ]);

        $venue->facilities()->sync($validated['facility'] ?? []);

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

        return redirect()
        ->route('merchant.venues.index')
        ->with('success', 'Venue berhasil ditambahkan.');
    }


    public function show(Venue $venue)
    {
        $venue->load(['fields.type', 'fields.featuredImage', 'images', 'facilities']);
        
        return Inertia::render('Merchant/Venue/Show', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'description' => $venue->description,
                'location' => $venue->location,
                'phone_number' => $venue->phone_number,
                'facilities' => $venue->facilities->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'icon' => $f->icon,
                ]),
                'fields' => $venue->fields->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'type' => $f->type->name ?? '-',
                    'price' => $f->timeslots->min('pivot.price') ?? 0,
                    'image' => $f->featuredImage 
                        ? asset($f->featuredImage->image_path) 
                        : null,
                ]),
                'images' => $venue->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => asset('storage/' . $img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]),
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
            'images' => fn ($q) => $q->orderBy('order')
        ]);

        return Inertia::render('Merchant/Venue/Edit', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'description' => $venue->description,
                'location' => $venue->location,
                'phone_number' => $venue->phone_number,
                'facility' => $venue->facilities->pluck('id'),
                'images' => $venue->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => asset('storage/' . $image->image_path),
                        'name' => basename($image->image_path),
                        'size' => function () use ($image) {
                            $image_path = $image->image_path;
                            return $image_path && Storage::disk('public')->exists($image_path)
                                ? Storage::disk('public')->size($image_path)
                                : 0;
                        },
                        'is_featured' => $image->is_featured, // tambahan: agar tahu mana gambar utama
                        'order' => $image->order,             // tambahan: bisa digunakan untuk urutan preview
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
            'location' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'facility' => 'array',
            'facility.*' => 'exists:facilities,id',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_image_ids' => 'nullable|json',
            'main_image_index' => 'nullable|integer|min:0',
            'main_image_id' => 'nullable|integer',
        ]);

        $venue->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
        ]);

        $venue->facilities()->sync($validated['facility'] ?? []);

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
        $venue->load('images');

        foreach ($venue->images as $image) {
            if (!empty($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $venue->delete();

        return redirect()->route('merchant.venues.index')->with('success', 'Venue berhasil dihapus!');
    }


}
