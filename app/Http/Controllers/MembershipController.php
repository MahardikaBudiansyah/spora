<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Venue;
use App\Models\Membership;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    protected function authorizeVenue(Venue $venue)
    {
        if ($venue->partner_id !== auth('partner')->id()) {
            abort(403, 'Anda tidak memiliki akses ke venue ini.');
        }
    }
    
    protected function authorizeField(Field $field)
    {
        if ($field->venue->partner_id !== auth('partner')->id()) {
            abort(403, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    protected function ensureFieldInVenue(Field $field, Venue $venue)
    {
        if ($field->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function index()
    {
        $this->authorizeVenue($venue);
        
        $memberships = Membership::with(['user', 'venue', 'membershipPackage', 'membershipDuration', 'invoices'])
            ->where('venue_id', $venue->id)
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $memberships->currentPage();
        $perPage = $memberships->perPage();

        $memberships->getCollection()->transform(function ($membership, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $membership->id,
                'user_id' => $membership->user_id,
                'membership_package_id' => $membership->membership_package_id,
                'membership_duration_id' => $membership->membership_duration_id,
                'total_price' => $membership->total_price,
                'start_date' => $membership->start_date,
                'end_date' => $membership->end_date,
                'slug' => $membership->slug,
                'created_at' => $membership->created_at->format('d M Y'),
                'updated_at' => $membership->updated_at->format('d M Y'),
            ];
        });

        return Inertia::render('Merchant/Membership/Index', [
            'memberships' => $memberships,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }

    public function show(Membership $membership)
    {
        //
    }

    
}
