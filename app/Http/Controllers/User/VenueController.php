<?php

namespace App\Http\Controllers\User;

use App\Enums\VenueStatus;
use App\Http\Controllers\User\Controller;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::activeAndApproved()
            ->with(['featuredImage', 'addresses.district', 'addresses.city', 'categories', 'courts.categories'])
            ->withAvg('reviews', 'venue_rating')
            ->withCount('reviews')
            ->paginate(12);

        return Inertia::render('User/Venues/Index', [
            'venues' => VenueResource::collection($venues),
        ]);
    }

    public function show(Venue $venue)
    {
        if (!$venue->is_active || $venue->status !== VenueStatus::APPROVED) {
            abort(404);
        }

        $venue->load([
            'images',
            'facilities',
            'categories',
            'socialMedia',
            'courts.surface',
            'courts.categories',
            'courts.featuredImage',
            'courts.timeSlots',
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
            'membershipPackages.discounts',
            'membershipPackages.others',
            'paymentPolicies' => function ($query) {
                $query->where('order_type', 'booking')
                    ->where('is_active', true);
            }
        ])->loadAvg('reviews', 'venue_rating')->loadCount('reviews');

        return Inertia::render('User/Venues/Show', [
            'venue' => new VenueResource($venue),
        ]);
    }
}
