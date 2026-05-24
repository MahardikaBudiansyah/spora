<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use App\Http\Resources\MerchantResource;
use App\Http\Resources\StatusHistoryResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\MembershipPackageResource;
use App\Http\Resources\VenuePaymentPolicyResource;

class VenueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $allPrices = $this->courts->flatMap(function ($court) {
            return $court->timeSlots->pluck('pivot.price');
        })->filter();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'phone_number' => $this->phone_number,
            'status' => $this->status,

            'is_active' => (bool) $this->is_active,
            'is_reverification_required' => (bool) $this->is_reverification_required,

            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
            'merchant' => new MerchantResource($this->whenLoaded('merchant')),

            'min_price' => $allPrices->min() ?? 0,

            'short_address' => $this->whenLoaded('addresses', function () {
                $address = $this->addresses->first();
                if (!$address) return null;

                $district = $address->district?->name ?? '';
                $city = $address->city?->name ? ', ' . $address->city->name : '';

                $result = $district . $city;
                return $result ?: null;
            }),

            'address' => new AddressResource($this->whenLoaded('address')),

            'description' => $this->description,

            'category_ids' => $this->whenLoaded('categories', fn() => $this->categories->pluck('id')),

            'venue_categories' => $this->whenLoaded('categories', function () {
                return $this->categories->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'label' => $c->label,
                ]);
            }),

            'facility_ids' => $this->whenLoaded('facilities', fn() => $this->facilities->pluck('id')),

            'facilities' => $this->whenLoaded('facilities', function () {
                return $this->facilities->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'icon' => $f->icon,
                ]);
            }),

            'courts_count' => $this->whenCounted('courts'),

            'courts' => $this->whenLoaded('courts', function () {
                return $this->courts->map(fn($f) => [
                    'id'                => $f->id,
                    'name'              => $f->name,
                    'slug'              => $f->slug,
                    'description'       => $f->description,
                    'surface'           => $f->surface->name ?? '-',
                    'categories'        => $f->categories->map(fn($cat) => [
                        'name'          => $cat->name,
                        'label'         => $cat->label,
                        'is_primary'    => $cat->pivot->is_primary,
                        'notes'         => $cat->pivot->notes,
                    ]),

                    'price_per_session' => $f->timeSlots->min('pivot.price') ?? 0,
                    'images'      => $f->images->map(fn($img) => [
                        'id'   => $img->id,
                        'url'  => asset('storage/' . $img->image_path),
                        'is_featured' => (bool) $img->is_featured
                    ]),
                    'image'             => $f->featuredImage
                        ? asset('storage/' . $f->featuredImage->image_path)
                        : asset('assets/images/court-default.jpg'),
                ]);
            }),

            'court_categories' => $this->whenLoaded('courts', function () {
                return $this->courts->flatMap->categories
                    ->unique('name')
                    ->map(fn($cat) => [
                        'name' => $cat->name,
                        'label' => $cat->label,
                        'is_primary' => $cat->pivot->is_primary ?? 0,
                    ])
                    ->values();
            }),

            'image' => $this->getVenueImage(),

            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => asset('storage/' . $img->image_path),
                    'name' => basename($img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]);
            }),

            'social_media' => $this->whenLoaded('socialMedia', function () {
                return $this->socialMedia->map(fn($sm) => [
                    'id' => $sm->id,
                    'platform' => ($sm->platform),
                    'username' => $sm->username,
                    'url' => $sm->url,
                ]);
            }),

            'membership_packages' => MembershipPackageResource::collection(
                $this->whenLoaded('membershipPackages')
            ),

            'payment_policies' => VenuePaymentPolicyResource::collection(
                $this->whenLoaded('paymentPolicies')
            ),

            'rating' => (float) ($this->reviews_avg_rating ?? 0),
            'review_count' => (int) ($this->reviews_count ?? 0),


        ];
    }

    private function getVenueImage()
    {
        if ($this->relationLoaded('featuredImage') && $this->featuredImage) {
            return asset('storage/' . $this->featuredImage->image_path);
        }

        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            $featured = $this->images->where('is_featured', true)->first() ?? $this->images->first();
            return asset('storage/' . $featured->image_path);
        }

        return asset('assets/images/court-default.jpg');
    }
}
