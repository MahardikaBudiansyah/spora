<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\SlotStatusLabel;
use App\Http\Controllers\User\Controller;
use App\Http\Resources\VenueResource;
use Illuminate\Pagination\LengthAwarePaginator;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::with(['featuredImage', 'addresses.district', 'addresses.city', 'categories', 'courts.categories'])
            ->withAvg('reviews', 'venue_rating')
            ->withCount('reviews')
            ->paginate(12);

        return Inertia::render('User/Venues/Index', [
            'venues' => VenueResource::collection($venues),
        ]);
    }

    public function show(Venue $venue) 
    {
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
            'paymentPolicies'
        ])->loadAvg('reviews', 'venue_rating')->loadCount('reviews');

        return Inertia::render('User/Venues/Show', [
            'venue' => new VenueResource($venue),
        ]);
    }
}
