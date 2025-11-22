<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class FieldController extends Controller
{
    public function index(Request $request)
    {
        $fields = Field::with('venue.merchant', 'type')
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Fields/Index', [
            'fields' => $fields,
        ]);
    }

    public function show(Venue $venue, Field $field)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $field);

        $field->load(['timeslots', 'type']);

        return Inertia::render('Admin/Venues/Fields/Show', [
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

}