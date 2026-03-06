<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'category' => $this->category,
            'data' => $this->data,
            'read_at' => $this->read_at,
            'is_read' => !is_null($this->read_at),
            'is_pinned' => (bool)$this->is_pinned,
            'is_archived' => (bool)$this->is_archived,
            'created_at_human' => Carbon::parse($this->created_at)->diffForHumans(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
