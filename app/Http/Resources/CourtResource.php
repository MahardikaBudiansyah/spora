<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CourtResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'description'      => $this->description,
            'merchant_name'    => $this->venue?->merchant?->name ?? '-',
            'venue' => [
                'name'         => $this->venue->name ?? '-',
                'slug'         => $this->venue->slug ?? '',
            ],
            'court_surface_id' => $this->court_surface_id,
            'court_surface'    => $this->surface->name ?? '-',
            'categories' => $this->categories->map(fn($cat) => [
                'id' => $cat->id,
                'name'       => $cat->name,
                'label'      => $cat->label,
                'is_primary' => $cat->pivot->is_primary,
                'order'      => $cat->pivot->order,
                'notes'      => $cat->pivot->notes,
            ]),

            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn($img) => [
                    'id'          => $img->id,
                    'url'         => asset('storage/' . $img->image_path),
                    'name'        => basename($img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order'       => $img->order,
                ]);
            }),

            'timeSlots' => $this->whenLoaded('timeSlots', function () {
                return $this->timeSlots->map(fn($ts) => [
                    'id'         => $ts->id,
                    'start_time' => $ts->start_time,
                    'end_time'   => $ts->end_time,
                    'day_type'   => $ts->pivot ? $ts->pivot->day_type : null,
                    'price'      => $ts->pivot ? $ts->pivot->price : 0,
                ]);
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
