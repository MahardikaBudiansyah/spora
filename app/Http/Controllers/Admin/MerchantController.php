<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Merchant;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class MerchantController extends Controller
{
    public function index(Request $request)
    {
        $merchants = Merchant::withCount('venues')
            ->with('address')
            ->orderBy('created_at', 'asc') // atau oldest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Merchants/Index', [
            'merchants' => $merchants,
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

    public function show(Merchant $merchant)
    {
        return Inertia::render('Admin/merchants/Show', [
            'merchant' => $merchant,
        ]);
    }

    public function destroy(Merchant $merchant)
    {
        $merchant->delete(); 

        return back()->with('success', 'Merchant berhasil dihapus.');
    }

}