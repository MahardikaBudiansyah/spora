<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\MerchantMembershipPackageRequest;

class MerchantMembershipPackageController extends Controller
{    
    public function index(Request $request)
    {
        $merchantId = auth('merchant')->id();

        $venues = Venue::with(['membershipPackages.discounts', 'membershipPackages.others'])
        ->where('merchant_id', $merchantId)
        ->get()
        ->map(function ($venue) {
            $venue->membership_packages = $venue->membershipPackages->map(function ($pkg) {
                $latestUpdate = collect([
                    $pkg->updated_at,
                    optional($pkg->discounts->max('updated_at')),
                    optional($pkg->others->max('updated_at')),
                ])->filter()->max();

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
                    'is_active'   => $pkg->is_active,
                    'updated_at'  => $latestUpdate?->format('Y-m-d H:i:s'), // tanggal update terakhir
                ];
            });
            return $venue;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'venues' => $venues,
            ]);
        }

        return Inertia::render('Merchant/Membership/MembershipPackage/Index', [
            'venues' => $venues,
        ]);
    }

    public function store(MerchantMembershipPackageRequest $request)
    {
        logger($request->all()); 
        $data = $request->validated();

        $package = MembershipPackage::create([
            'venue_id' => $request->venue_id,
            'name' => $data['package_name'],
            'duration_months' => $data['package_duration_months'],
            'price' => $data['package_price'],
            'description' => $data['package_descriptions'],
        ]);

        if ($data['discount_name']) {
            $package->discounts()->create([
                'name' => $data['discount_name'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount_limit' => $data['discount_limit'],
                'description' => $data['discount_descriptions'],
            ]);
        }

        if ($data['other_name']) {
            $package->others()->create([
                'name' => $data['other_name'],
                'description' => $data['other_descriptions'],
            ]);
        }

        // Jika pakai useForm Inertia, cukup return redirect back atau with
        return back()->with([
            'package' => $package->fresh()->load(['discounts', 'others']),
        ]);
    }


    public function update(MerchantMembershipPackageRequest $request, MembershipPackage $membershipPackages)
    {
        $data = $request->validated();

        $membershipPackages->update([
            'name' => $data['package_name'],
            'duration_months' => $data['package_duration_months'],
            'price' => $data['package_price'],
            'description' => $data['package_descriptions'],
        ]);

        $membershipPackages->discounts()->delete();
        $membershipPackages->others()->delete();

        if ($data['discount_name']) {
            $membershipPackages->discounts()->create([
                'name' => $data['discount_name'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount_limit' => $data['discount_limit'],
                'description' => $data['discount_descriptions'],
            ]);
        }

        if ($data['other_name']) {
            $membershipPackages->others()->create([
                'name' => $data['other_name'],
                'description' => $data['other_descriptions'],
            ]);
        }

        return back()->with([
            'package' => $membershipPackages->fresh()->load(['discounts', 'others']),
        ]);
    }

    public function destroy(MembershipPackage $membershipPackages)
    {
        $membershipPackages->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paket berhasil dihapus',
        ]);
    }

    public function toggleActive(MembershipPackage $membershipPackages, Request $request)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $membershipPackages->is_active = $request->is_active;
        $membershipPackages->save();

        return response()->json([
            'message' => 'Status paket berhasil diperbarui',
            'is_active' => $membershipPackages->is_active,
        ]);
    }


}
