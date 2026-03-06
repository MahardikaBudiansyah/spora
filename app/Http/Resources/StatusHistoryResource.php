<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'status' => $this->status,
            'reason' => $this->reason,
            'change_by_snapshot' => $this->change_by_snapshot,
            'is_system_generated' => (bool)$this->is_system_generated,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
