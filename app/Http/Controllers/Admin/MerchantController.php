<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Controller;
use App\Http\Resources\MerchantResource;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MerchantController extends Controller
{
    public function index(Request $request)
    {
        $merchants = Merchant::withCount(['payoutMethods', 'venues'])
            ->with([
                'latestStatusHistory',
                'profile.address.province',
                'profile.address.city',
                'profile.address.district',
                'profile.address.village',
                'profileSubmission.address.province',
                'profileSubmission.address.city',
                'profileSubmission.address.district',
                'profileSubmission.address.village',
                'primaryPayoutMethod',
            ])
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Merchants/Index', [
            'merchants' => MerchantResource::collection($merchants),
        ]);
    }

    public function show(Merchant $merchant)
    {
        return Inertia::render('Admin/Merchants/Show', [
            'merchant' => $merchant,
        ]);
    }

    public function toggleActive(Merchant $merchant, Request $request)
    {
        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $merchant->is_active = $request->is_active;
        $merchant->save();

        return back()->with('success', 'Status Merchant diperbarui.');
    }

    public function destroy(Merchant $merchant)
    {
        $merchant->delete();

        return back()->with('success', 'Merchant berhasil dihapus.');
    }
}
