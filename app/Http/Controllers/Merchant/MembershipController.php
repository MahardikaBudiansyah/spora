<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Merchant\Controller;

class MembershipController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Venue::class, 'venue');
    }

    public function index(Request $request, Venue $venue)
    {
        $memberships = Membership::with(['membershipUser.user', 'membershipPackage.discounts', 'membershipPackage.others', 'invoice'])
            ->whereHas('membershipPackage', function ($query) use ($venue) {
                $query->where('venue_id', $venue->id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $memberships->currentPage();
        $perPage = $memberships->perPage();

        $memberships->getCollection()->transform(function ($membership, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $membership->id,
                'order_no' => $membership->order_no,
                'user' => $membership->membershipUser && $membership->membershipUser->user
                    ? [
                        'id' => $membership->membershipUser->user->id,
                        'user_name' => $membership->membershipUser->user->name,
                        'phone_number' => $membership->membershipUser->user->phone_number,
                    ] : null,
                'membership_package' => [
                    'id' => $membership->membershipPackage->id,
                    'package_name' => $membership->membershipPackage->name,
                    'price' => $membership->membershipPackage->price,
                    'duration_months' => $membership->membershipPackage->duration_months,
                ],
                'total_price' => $membership->total_price,
                'start_date' => $membership->start_date,
                'end_date' => $membership->end_date,
                'remaining_discount_limits' => $membership->remaining_discount_limits,
                'status' => $membership->status,
                'slug' => $membership->slug,
                'created_at' => $membership->created_at,
                'updated_at' => $membership->updated_at,
                'discounts' => $membership->membershipPackage->discounts ?? [],
                'others' => $membership->membershipPackage->others ?? [],
                'invoice' => $membership->invoice ?? [],
            ];
        });


        return Inertia::render('Merchant/Venue/Membership/Index', [
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
