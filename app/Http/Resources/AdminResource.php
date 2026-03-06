<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AdminProfileResource;
use App\Http\Resources\PlatformProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),

            'is_active' => (bool) $this->is_active,
            'slug' => $this->slug,
            'avatar_path' => $this->avatar_path ?? '/assets/images/default-logo.png',

            'role' => $this->role,

            'profile' => new AdminProfileResource($this->whenLoaded('profile')),
            'platform_profile' => new PlatformProfileResource($this->whenLoaded('platformProfile')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
