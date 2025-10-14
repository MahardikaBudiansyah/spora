<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Merchant\Controller;

class MerchantMembershipController extends Controller
{    
    public function index(Request $request)
    {
        $merchantId = auth('merchant')->id();

        $memberships = Membership::with(['user', 'membershipPackage.venue', 'membershipDuration', 'invoices'])
            ->whereHas('membershipPackage.venue', function ($query) use ($merchantId) {
                $query->where('merchant_id', $merchantId);
            })
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
                'venue' => [
                    'id' => $membership->venue->id,
                    'name' => $membership->venue->name,
                    'slug' => $membership->venue->slug,
                ],
                'created_at' => $membership->created_at->format('d M Y'),
                'updated_at' => $membership->updated_at->format('d M Y'),
            ];
        });

        return Inertia::render('Merchant/Membership/Index', [
            'memberships' => $memberships,
        ]);
    }


}
