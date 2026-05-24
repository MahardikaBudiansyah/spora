<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VenueStatus;
use App\Http\Controllers\Admin\Controller;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use App\Notifications\Merchant\VenueVerificationApprovedNotification;
use App\Notifications\Merchant\VenueVerificationRejectedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Log;

class VenueVerificationController extends Controller
{
    public function index(Venue $venue)
    {
        $venue->load([
            'merchant',
            'categories',
            'facilities',
            'images',
            'address.village',
            'address.district',
            'address.city',
            'address.province',
            'paymentPolicies',
            'statusHistories',
            'latestStatusHistory',
            'membershipPackages',
            'courts',

        ]);

        return Inertia::render('Admin/Venues/Verification', [
            'venue' => new VenueResource($venue),
        ]);
    }

    public function updateVenueVerification(Request $request, Venue $venue)
    {
        $request->validate([
            'status' => ['required', new Enum(VenueStatus::class)],
            'reason' => [
                'required_if:status,rejected',
                'nullable',
                'string',
                'min:10',
                'max:500'
            ],
        ]);

        try {
            DB::transaction(function () use ($request, $venue) {
                $status = $request->status;
                $reason = $request->reason;

                $venue->update([
                    'status' => $status,
                    'is_active' => $status === VenueStatus::APPROVED->value ? true : false,
                    'is_reverification_required' => false,
                ]);

                $message = $status === VenueStatus::APPROVED->value
                    ? "Venue disetujui oleh Admin."
                    : "Venue ditolak: {$reason}";

                $venue->recordStatusHistory($message, $reason);

                if ($status === VenueStatus::APPROVED->value) {
                    $venue->merchant->notify(new VenueVerificationApprovedNotification($venue));
                } else {
                    $venue->merchant->notify(new VenueVerificationRejectedNotification($venue, $reason));
                }
            });

            return back()->with('success', 'Verifikasi data venue berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error("Gagal verifikasi venue ID {$venue->id}: " . $e->getMessage());
            return back()->withErrors(['message' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
