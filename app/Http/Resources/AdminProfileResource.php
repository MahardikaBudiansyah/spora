<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'admin_id' => $this->admin_id,
            'nik' => $this->nik,
            'full_name' => $this->full_name,
            'phone_number' => $this->phone_number,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,

            'photo_path' => $this->photo_path ? asset('storage/' . $this->photo_path) : null,
            'ktp_photo_path' => $this->ktp_photo_path ? asset('storage/' . $this->ktp_photo_path) : null,
            'selfie_photo_path' => $this->selfie_photo_path ? asset('storage/' . $this->selfie_photo_path) : null,

            'address' => new AddressResource($this->whenLoaded('address')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
