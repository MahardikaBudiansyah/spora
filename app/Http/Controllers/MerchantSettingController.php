<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;

class MerchantSettingController extends Controller
{
    public function index(Request $request)
    {
        $merchant = auth('merchant')->user();

        // eager load relasi paymentType
        $merchant->load(['venues.paymentType']);

        return Inertia::render('Merchant/Setting/Index', [
            'merchant' => $merchant->toArray(),
        ]);
    }

    public function update(Request $request)
    {
        $merchant = auth('merchant')->user();

        $data = $request->validate([
            'venues' => 'required|array',
            'venues.*.venue_id' => 'required|exists:venues,id',
            'venues.*.enable_dp' => 'boolean',
            'venues.*.dp_type' => 'nullable|string|in:percentage,fixed',
            'venues.*.dp_value' => 'nullable|numeric|min:0',
            'venues.*.apply_to_merchant' => 'boolean',
            'venues.*.is_active' => 'boolean',
        ]);

        foreach ($data['venues'] as $venueData) {
            $venue = Venue::where('merchant_id', $merchant->id)
                ->where('id', $venueData['venue_id'])
                ->firstOrFail();

            $venue->paymentType()->updateOrCreate(
                ['venue_id' => $venue->id],
                [
                    'enable_dp' => $venueData['enable_dp'] ?? false,
                    'dp_type' => $venueData['dp_type'] ?? null,
                    'dp_value' => $venueData['dp_value'] ?? null,
                    'apply_to_merchant' => $venueData['apply_to_merchant'] ?? false,
                    'is_active' => $venueData['is_active'] ?? true,
                ]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan tipe pembayaran berhasil disimpan.');
    }
}
