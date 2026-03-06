<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use App\Http\Resources\StatusHistoryResource;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantOwnerSubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'nik' => $this->nik,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,

            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),


            'photo_path' => $this->photo_path ? asset('storage/' . $this->photo_path) : null,
            'ktp_photo_path' => $this->ktp_photo_path ? asset('storage/' . $this->ktp_photo_path) : null,
            'selfie_photo_path' => $this->selfie_photo_path ? asset('storage/' . $this->selfie_photo_path) : null,

            'address' => new AddressResource($this->whenLoaded('address')),

            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
