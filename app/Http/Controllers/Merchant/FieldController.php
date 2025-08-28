<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use App\Models\TimeSlot;
use App\Models\FieldType;
use App\Models\SlotStatus;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SlotStatusLabel;
use App\Helpers\UploadImageHelper;
use App\Events\TimeslotStatusUpdated;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Merchant\Controller;

class FieldController extends Controller
{
    protected function authorizeVenue(?Venue $venue)
    {
        if (!$venue || $venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke venue ini.');
        }
    }

    protected function authorizeField(Field $field)
    {
        if ($field->venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    protected function ensureFieldInVenue(Field $field, Venue $venue)
    {
        if ($field->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);
        
        $fields = Field::with(['venue', 'type'])
            ->where('venue_id', $venue->id)
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $fields->currentPage();
        $perPage = $fields->perPage();

        $fields->getCollection()->transform(function ($field, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $field->id,
                'slug' => $field->slug,
                'name' => $field->name,
                'fieldType' => $field->type->name,
                'description' => $field->description,
                'venueName' => $field->venue->name ?? '-',
                'updated_at' => $field->updated_at->format('d M Y'),
            ];
        });

        return Inertia::render('Merchant/Field/Index', [
            'fields' => $fields,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }



    public function create(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);

        $timeslots = TimeSlot::orderBy('id')->get(['id', 'name']);
        $fieldTypes = FieldType::all();

        return Inertia::render('Merchant/Field/Create', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'timeslots' => $timeslots,
            'fieldTypes' => $fieldTypes,
        ]);
    }


    public function store(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'field_type_id' => 'required|exists:field_types,id',
            'timeslots' => 'nullable|array',
            'timeslots.*.id' => 'required|exists:time_slots,id',
            'timeslots.*.price' => 'required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'main_image_index' => 'nullable|integer|min:0',
        ]);

        $field = $venue->fields()->create([
            'name' => $validated['name'],
            'field_type_id' => $validated['field_type_id'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['timeslots'])) {
            $syncData = collect($validated['timeslots'])
                ->mapWithKeys(fn ($slot) => [$slot['id'] => ['price' => $slot['price']]])
                ->toArray();

            $field->timeslots()->sync($syncData);
        }

        if ($request->hasFile('images')) {
            $fieldNameSlug = Str::slug($field->name);
            $folderPath = "uploads/fields/{$field->id}";
            $featuredIndex = intval($validated['main_image_index'] ?? 0);

            $uploadedImages = UploadImageHelper::handle(
                $request->file('images'),
                $folderPath,
                $fieldNameSlug,
                $featuredIndex,
                $field->id,
            );

            $field->images()->createMany($uploadedImages);
        }

        return redirect()
            ->route('merchant.venues.fields.index', $venue->slug)
            ->with('success', 'Lapangan berhasil ditambahkan.');
    }



    public function show(Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);

        $field->load(['timeslots', 'type']);

        return Inertia::render('Merchant/Field/Show', [
            'venue' => $venue,
            'field' =>  [ 
                'id' => $field->id,
                'name' => $field->name,
                'field_type' =>$field->type->name,
                'images' => $field->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => asset('storage/' . $img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]),
                'slug' => $field->slug,
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
        ]);
    }


    public function edit(Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);

        $this->ensureFieldInVenue($field, $venue);

        $field->load([
            'timeslots', 
            'venue',  
            'images' => fn ($q) => $q->orderBy('order')
        ]);

        return Inertia::render('Merchant/Field/Edit', [
            'venue' => $venue,
            'field' => [
                'id' => $field->id,
                'name' => $field->name,
                'field_type_id' => $field->field_type_id,
                'description' => $field->description,
                'timeslot_ids' => $field->timeslots->pluck('id'),
                'prices' => $field->timeslots->mapWithKeys(fn ($ts) => [
                    $ts->id => $ts->pivot->price,
                ]),
                'slots' => $field->timeslots->map(function ($ts) {
                    return [
                        'timeslot_id' => $ts->id,
                        'price' => $ts->pivot->price,
                    ];
                }),
                'images' => $field->images->map(function ($image) {
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
                'venue' => [
                    'id' => $field->venue->id,
                    'slug' => $field->venue->slug,
                    'name' => $field->venue->name,
                ],
                'slug' => $field->slug,
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
            'fieldTypes' => FieldType::all(['id', 'name']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
        ]);
    }


    public function update(Request $request, Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);

        $this->ensureFieldInVenue($field, $venue);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'field_type_id' => 'required|exists:field_types,id',
            'description' => 'nullable|string',
            'timeslots' => 'array',
            'timeslots.*' => 'exists:time_slots,id',
            'price' => 'array',
            'price.*' => 'numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_image_ids' => 'nullable|json',
            'main_image_index' => 'nullable|integer|min:0',
            'main_image_id' => 'nullable|integer',
        ]);

        $field->update([
            'name' => $validated['name'],
            'field_type_id' => $validated['field_type_id'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['timeslots']) && !empty($validated['price'])) {
            $this->syncTimeslots($field, $validated['timeslots'], $validated['price']);
        }

        UploadImageHelper::syncImages($field, $request, [
            'slug_name' => $validated['name'],
            'folder' => "uploads/fields"
        ]);

        return redirect()
            ->route('merchant.venues.fields.index', $field->venue->slug)
            ->with('success', 'Lapangan berhasil diperbarui.');
    }


    public function destroy(Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue); 
        $this->authorizeField($field); 

        $this->ensureFieldInVenue($field, $venue);

        $field->load('images');

        foreach ($field->images as $image) {
            if (!empty($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $field->delete();

        return redirect()
            ->route('merchant.venues.fields.index', $venue->slug)
            ->with('success', 'Lapangan berhasil dihapus.');
    }


    public function calendar(Request $request, Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);
        $this->ensureFieldInVenue($field, $venue);

        $field->load([
            'type',
            'venue',
            'timeslots', 
        ]);

        return Inertia::render('Merchant/Field/Partials/FieldCalendar', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'field' => [
                'id' => $field->id,
                'name' => $field->name,
                'field_type' => $field->type->name,
                'prices' => $field->timeslots->mapWithKeys(fn ($ts) => [
                    $ts->id => $ts->pivot->price,
                ]),
                'slug' => $field->slug,
                'slots' => $field->timeslots->map(fn($ts) => [
                    'timeslot_id' => $ts->id,
                    'price' => $ts->pivot->price,
                ]),
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
            'fieldTypes' => FieldType::all(['id', 'name']),
            'slotStatusLabel' => SlotStatusLabel::all(['id', 'label']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
        ]);
    }


    protected function syncTimeslots(Field $field, array $timeslotIds, array $prices)
    {
        $syncData = [];

        foreach ($timeslotIds as $id) {
            $syncData[$id] = ['price' => $prices[$id] ?? 0];
        }

        $field->timeslots()->sync($syncData);
    }

}
