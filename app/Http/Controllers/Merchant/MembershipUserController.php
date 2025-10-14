<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;


class MembershipUserController extends Controller
{    
    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        // Mulai query
        $query = $venue->membershipUsers()
            ->with([
                'user', 
                'memberships.membershipPackage' // history memberships beserta paket
            ])
            ->latest();

        // Filter search berdasarkan nama user atau member_no
        if ($search = $request->query('search')) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('member_no', 'like', "%{$search}%");
        }

        // Pagination 15 per halaman
        $membershipUsers = $query->paginate(15)->withQueryString();

        return Inertia::render('Merchant/Venue/Membership/Member/Index', [
            'venue' => $venue,
            'users' => $membershipUsers,
            'filters' => $request->only(['search']),
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
