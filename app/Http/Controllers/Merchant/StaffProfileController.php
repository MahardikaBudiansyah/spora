<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\MerchantResource;

class StaffProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $merchant = $request->user();
        $merchant->load([
            'profile.address.village',
            'profile.address.district',
            'profile.address.city',
            'profile.address.province',
            'owner.address.village',
            'owner.address.district',
            'owner.address.city',
            'owner.address.province',
            'socialMedia',
            'primaryPayoutMethod',
            'payoutMethods'
        ]);

        $venues = Venue::where('merchant_id', $merchant->id)
            ->with([
                'courts' => function ($query) {
                    $query->select('id', 'venue_id', 'name', 'slug');
                },
                'address.province',
                'address.city',
                'address.district',
                'address.village'
            ])
            ->latest()
            ->get();

        return Inertia::render('Merchant/Profile/Index', [
            'merchant' => new MerchantResource($merchant),
            'venues' => $venues,
        ]);
    }

    public function settings()
    {
        return Inertia::render('Merchant/Settings');
    }
}
