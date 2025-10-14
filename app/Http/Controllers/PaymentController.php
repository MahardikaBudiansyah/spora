<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Membership;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Menangani sukses pembayaran untuk booking dan membership
     */
    public function success(string $type, $orderId)
    {
        $user = Auth::user();
        $profileIncomplete = empty($user->name) || empty($user->phone_number);

        // Ambil transaksi sesuai type
        $transaction = match ($type) {
            'booking' => $this->getBookingTransaction($orderId, $user),
            'membership' => $this->getMembershipTransaction($orderId, $user),
            default => abort(404, 'Type tidak valid'),
        };

        return Inertia::render('User/Payment/Success', [
            'message' => 'Pembayaran berhasil!',
            'user' => $user,
            'transaction' => $transaction,
            'type' => $type,
            'profileIncomplete' => $profileIncomplete,
        ]);
    }

    private function getBookingTransaction($gatewayOrderId, $user)
    {
        return Booking::with([
            'venue', 
            'venue.featuredImage', 
            'customers',
            'details.field', 
            'details.timeSlot',
            'invoice', 
            'invoice.payments', 
            'invoice.payments.detail'
        ])
        ->whereHas('invoice.payments', function($q) use ($gatewayOrderId) {
            $q->where('gateway_order_id', $gatewayOrderId);
        })
        ->whereHas('customers', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('phone_number', $user->phone_number);
        })
        ->firstOrFail();
    }

    private function getMembershipTransaction($gatewayOrderId, $user)
    {
        return Membership::with([
            'membershipPackage',
            'membershipPackage.discounts',
            'membershipPackage.others',
            'invoice',
            'invoice.payments',
            'invoice.payments.detail'
        ])
        ->whereHas('invoice.payments', function($q) use ($gatewayOrderId) {
            $q->where('gateway_order_id', $gatewayOrderId);
        })
        ->where('membership_user_id', $user->id)
        ->firstOrFail();
    }


    /**
     * Halaman gagal pembayaran
     */
    public function failed()
    {
        return Inertia::render('User/Payment/Failed', [
            'message' => 'Pembayaran gagal atau dibatalkan.',
        ]);
    }
}
