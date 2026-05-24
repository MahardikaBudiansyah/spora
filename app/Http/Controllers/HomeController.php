<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Venue;
use App\Http\Controllers\Controller;
use App\Http\Resources\VenueResource;

class HomeController extends Controller
{
    public function index()
    {
        $venues = Venue::with(['featuredImage', 'addresses.district', 'addresses.city', 'categories', 'courts.categories'])
            ->withAvg('reviews', 'venue_rating')
            ->withCount('reviews')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Home', [
            'venues' => VenueResource::collection($venues),
        ]);
    }
}
