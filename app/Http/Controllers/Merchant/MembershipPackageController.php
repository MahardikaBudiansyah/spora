<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\MembershipPackageRequest;

class MembershipPackageController extends Controller
{    
    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        $packages = $venue->membershipPackages()
            ->with(['discounts', 'others'])
            ->latest()
            ->get();

        return inertia('Merchant/Venue/Membership/MembershipPackage/Index', [
            'venue' => $venue,
            'packages' => $packages,
        ]);
    }

    public function store(MembershipPackageRequest $request, Venue $venue)
    {
        $this->authorize('update', $venue);

        $data = $request->validated();

        $package = MembershipPackage::create([
            'venue_id' => $venue->id,
            'name' => $data['package_name'],
            'duration_months' => $data['package_duration_months'],
            'price' => $data['package_price'],
            'description' => $data['package_descriptions'] ?? null,
        ]);

        // Simpan discounts
        if (!empty($data['discount_name'])) {
            $package->discounts()->create([
                'name' => $data['discount_name'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount_limit' => $data['discount_limit'],
                'description' => $data['discount_descriptions'] ?? null,
            ]);
        }

        if (!empty($data['other_name'])) {
            $package->others()->create([
                'name' => $data['other_name'],
                'description' => $data['other_descriptions'] ?? null,
            ]);
        }

        return back()->with([
            'package' => $package->fresh()->load(['discounts', 'others']),
        ]);
    }

    public function update(MembershipPackageRequest $request, Venue $venue, MembershipPackage $package)
    {
        $this->authorize('update', $venue);

        $data = $request->validated();

        $package->update([
            'name' => $data['package_name'],
            'duration_months' => $data['package_duration_months'],
            'price' => $data['package_price'],
            'description' => $data['package_descriptions'] ?? null,
        ]);

        // Hapus dulu relasi lama
        $package->discounts()->delete();
        $package->others()->delete();

        // Simpan ulang relasi baru
        if (!empty($data['discount_name'])) {
            $package->discounts()->create([
                'name' => $data['discount_name'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount_limit' => $data['discount_limit'],
                'description' => $data['discount_descriptions'] ?? null,
            ]);
        }

        if (!empty($data['other_name'])) {
            $package->others()->create([
                'name' => $data['other_name'],
                'description' => $data['other_descriptions'] ?? null,
            ]);
        }

        return back()->with([
            'package' => $package->fresh()->load(['discounts', 'others']),
        ]);
    }

    public function destroy(Venue $venue, MembershipPackage $package)
    {
        $this->authorize('update', $venue);

        $package->delete();

        return response()->json([
            'success' => true,
            'message' => "Paket '{$package->name}' berhasil dihapus.",
        ]);
    }

    public function toggleActive(Request $request, Venue $venue, MembershipPackage $package)
    {
        $this->authorize('update', $venue);

        $package->is_active = !$package->is_active;
        $package->save();

        return response()->json([
            'success' => true,
            'message' => "Status paket {$package->name} berhasil diubah.",
            'is_active' => $package->is_active,
        ]);
    }



}
