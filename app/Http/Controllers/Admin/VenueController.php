<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Http\Resources\VenueResource;
use App\Http\Controllers\Admin\Controller;

class VenueController extends Controller
{
    public function index(Request $request)
    {
        $venues = Venue::withCount('courts')
            ->with([
                'latestStatusHistory',
                'merchant',
                'address.village',
                'address.district',
                'address.city',
                'address.province'
            ])
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Venues/Index', [
            'venues' => VenueResource::collection($venues)->response()->getData(true),
        ]);
    }

    public function toggleActive(Venue $venue, Request $request)
    {
        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $venue->is_active = $request->is_active;
        $venue->save();

        return back()->with('success', 'Status data Venue diperbarui.');
    }

    public function show(Venue $venue)
    {
        $venue->load([
            'courts.surface',
            'courts.featuredImage',
            'images',
            'facilities',
            'categories',
            'socialMedia',
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
            'membershipPackages.discounts',
            'membershipPackages.others',
            'paymentType'
        ])->loadAvg('reviews', 'venue_rating')->loadCount('reviews');

        return Inertia::render('Admin/Venues/Show', [
            'venue' => new VenueResource($venue),
        ]);
    }

    public function destroy(Venue $venue)
    {
        $venue->delete();

        return back()->with('success', 'Data Venue berhasil dihapus.');
    }
}
