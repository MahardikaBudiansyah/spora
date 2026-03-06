<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use App\Models\MembershipOrder;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;

class MembershipController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Venue::class, 'venue');
    }

    public function index(Request $request, Venue $venue)
    {
        $membership_orders = MembershipOrder::with(['membershipCard.user', 'membershipPackage.discounts', 'membershipPackage.others', 'invoice'])
            ->whereHas('membershipPackage', function ($query) use ($venue) {
                $query->where('venue_id', $venue->id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $membership_orders->currentPage();
        $perPage = $membership_orders->perPage();

        $membership_orders->getCollection()->transform(function ($membership_order, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $membership_order->id,
                'order_no' => $membership_order->order_no,
                'user' => $membership_order->membershipCard && $membership_order->membershipCard->user
                    ? [
                        'id' => $membership_order->membershipCard->user->id,
                        'user_name' => $membership_order->membershipCard->user->name,
                        'phone_number' => $membership_order->membershipCard->user->phone_number,
                    ] : null,
                'membership_package' => [
                    'id' => $membership_order->membershipPackage->id,
                    'package_name' => $membership_order->membershipPackage->name,
                    'price' => $membership_order->membershipPackage->price,
                    'duration_months' => $membership_order->membershipPackage->duration_months,
                ],
                'total_price' => $membership_order->total_price,
                'start_date' => $membership_order->start_date,
                'end_date' => $membership_order->end_date,
                'remaining_discount_limits' => $membership_order->remaining_discount_limits,
                'status' => $membership_order->status,
                'slug' => $membership_order->slug,
                'created_at' => $membership_order->created_at,
                'updated_at' => $membership_order->updated_at,
                'discounts' => $membership_order->membershipPackage->discounts ?? [],
                'others' => $membership_order->membershipPackage->others ?? [],
                'invoice' => $membership_order->invoice ?? [],
            ];
        });


        return Inertia::render('Merchant/Venue/Membership/Index', [
            'membership_orders' => $membership_orders,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }


    public function create(Request $request, Venue $venue)
    {
        $venue->load([
            'addresses.village',
            'addresses.district',
            'addresses.city',
            'addresses.province',
        ]);

        // AUTH USER (customer yang login)
        $customer = $request->user('web'); // guard users
        $merchant = $request->user('merchant'); // guard partner/merchant

        $membershipPackages = MembershipPackage::with(['discounts', 'others'])
            ->where('venue_id', $venue->id)
            ->orderBy('name')
            ->get()
            ->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'slug' => $pkg->slug,
                    'name' => $pkg->name,
                    'duration_months' => $pkg->duration_months,
                    'price' => $pkg->price,
                    'description' => $pkg->description,
                    'membership_benefit_discounts' => $pkg->discounts->map(function ($d) {
                        return [
                            'id' => $d->id,
                            'name' => $d->name,
                            'discount_type' => $d->discount_type,
                            'discount_value' => $d->discount_value,
                            'discount_limit' => $d->discount_limit,
                            'description' => $d->description,
                        ];
                    }),
                    'membership_benefit_others' => $pkg->others->map(function ($o) {
                        return [
                            'id' => $o->id,
                            'name' => $o->name,
                            'description' => $o->description,
                        ];
                    }),
                    'is_active' => $pkg->is_active,
                ];
            });

        return Inertia::render('Merchant/Venue/Membership/Create', [
            'venue' => $venue,
            'membershipPackages' => $membershipPackages,
            'merchant' => $merchant,
            'customer' => $customer ? [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone_number' => $customer->phone_number,
            ] : null,
        ]);
    }



    public function show(MembershipOrder $membership_order)
    {
        //
    }

    
}
