<?php

namespace App\Http\Controllers\Merchant;

use Exception;
use Inertia\Inertia;
use App\Models\Venue;
use App\Enums\OrderType;
use Illuminate\Http\Request;
use App\Models\VenuePaymentPolicy;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\VenueResource;
use App\Http\Requests\Merchant\VenuePaymentPolicyUpdateRequest;

class VenuePaymentPolicyController extends Controller
{
    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        $venue->load(['paymentPolicies']);

        return Inertia::render('Merchant/Venue/Settings/VenuePaymentPolicies/Index', [
            'venue' => new VenueResource($venue),
        ]);
    }

    public function update(VenuePaymentPolicyUpdateRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            VenuePaymentPolicy::updateOrCreate(
                [
                    'venue_id'   => $validated['venue_id'],
                    'order_type' => OrderType::BOOKING,
                ],
                [
                    'enable_dp'                => $request->boolean('enable_dp'),
                    'dp_type'                  => $validated['dp_type'],
                    'dp_value'                 => $validated['dp_value'],
                    'full_payment_days_before' => $validated['full_payment_days_before'],
                    'max_full_payment_days'    => $validated['max_full_payment_days'],
                    'enable_refund'            => $request->boolean('enable_refund'),
                    'refund_percentage'        => $validated['refund_percentage'],
                ]
            );

            DB::commit();
            return redirect()->back()->with('success', 'Kebijakan pembayaran berhasil diperbarui.');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Gagal update Payment Policy: " . $e->getMessage());

            return redirect()->back()->withErrors([
                'error' => 'Terjadi kesalahan sistem saat menyimpan data.'
            ]);
        }
    }

}
