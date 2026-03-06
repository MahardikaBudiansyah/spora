<?php

namespace App\Http\Controllers;

use Log;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Enums\OrderType;
use App\Models\MembershipOrder;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BookingResource;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\MembershipOrderResource;

class GatewayRedirectController extends Controller
{
    public function success(string $type, $orderId)
    {
        $user = Auth::user();

        session()->forget([
            'checkout_cart_ids', 'checkout_venue_id', 'latest_summary',
            'latest_membership_summary', 'selected_membership_package_id', 'gateway_data'
        ]);

        $payment = Payment::where('gateway_order_id', $orderId)->firstOrFail();
        
        $invoice = Invoice::with(['order', 'payments.detail'])
            ->where('id', $payment->invoice_id)
            ->firstOrFail();

        $this->authorizeTransaction($invoice, $user);

        return Inertia::render('User/Payments/Success', [
            'message'     => 'Pembayaran berhasil!',
            'user'        => new UserResource($user), 
            'transaction' => new TransactionResource($invoice), 
            'type'        => $type,
        ]);
    }

    private function authorizeTransaction(Invoice $invoice, $user)
    {
        $isOwner = false;

        if ($invoice->order instanceof Booking) {
            $isOwner = $invoice->order->customer->user_id === $user->id;
        } elseif ($invoice->order instanceof MembershipOrder) {
            $isOwner = $invoice->order->membershipCard->user_id === $user->id;
        }

        if (!$isOwner) {
            Log::warning("Akses ditolak. User {$user->id} mencoba akses Invoice #{$invoice->id}");
            abort(403, 'Anda tidak memiliki akses ke transaksi ini.');
        }
    }
    
    public function failed()
    {
        return Inertia::render('User/Payments/Failed', [
            'message' => 'Pembayaran gagal atau dibatalkan.',
        ]);
    }

    // public function success(string $type, $orderId)
    // {
    //     $user = Auth::user();

    //     session()->forget([
    //         'checkout_cart_ids', 
    //         'checkout_venue_id', 
    //         'latest_summary',
    //         'latest_membership_summary',
    //         'selected_membership_package_id',
    //         'gateway_data'
    //     ]);

    //     try {
    //         $orderType = OrderType::from($type);
    //     } catch (\ValueError $e) {
    //         abort(404, 'Tipe pesanan tidak valid');
    //     }

    //     $transaction = match ($orderType) {
    //         OrderType::BOOKING => new BookingResource($this->getBookingTransaction($orderId, $user)),
    //         OrderType::MEMBERSHIP => new MembershipOrderResource($this->getMembershipTransaction($orderId, $user)),
    //     };

    //     return Inertia::render('User/Payments/Success', [
    //         'message'     => 'Pembayaran berhasil!',
    //         'user'        => (new UserResource($user)), 
    //         'transaction' => $transaction,
    //         'type'        => $type,
    //     ]);
    // }

    // private function getBookingTransaction($gatewayOrderId, $user)
    // {
    //     $payment = Payment::with(['detail', 'invoice'])
    //         ->where('gateway_order_id', $gatewayOrderId)
    //         ->firstOrFail(); 

    //     $booking = Booking::with(['customer']) 
    //         ->where('id', $payment->invoice->order_id)
    //         ->firstOrFail();

    //     if ($booking->customer->user_id !== $user->id) {
    //         Log::warning("Akses ditolak. User {$user->id} tidak memiliki akses ke Booking #{$booking->id}");
    //         abort(403, 'Anda tidak memiliki akses ke transaksi ini.');
    //     }
        
    //     $booking->setRelation('invoice', $payment->invoice);
    //     $booking->setRelation('latest_payment', $payment);
        
    //     return $booking;
    // }

    // private function getMembershipTransaction($gatewayOrderId, $user)
    // {
    //     $payment = Payment::with(['detail', 'invoice'])
    //         ->where('gateway_order_id', $gatewayOrderId)
    //         ->firstOrFail();

    //     $membershipOrder = MembershipOrder::with(['membershipCard'])
    //         ->where('id', $payment->invoice->order_id)
    //         ->firstOrFail();

    //     if ($membershipOrder->membershipCard->user_id !== $user->id) {
    //         Log::warning("Akses ditolak. User {$user->id} tidak memiliki akses ke Booking #{$membershipOrder->id}");
    //         abort(403, 'Anda tidak memiliki akses ke transaksi ini.');
    //     }

    //     $membershipOrder->setRelation('invoice', $payment->invoice);
    //     $membershipOrder->setRelation('latest_payment', $payment);
        
    //     return $membershipOrder;
    // }

    // public function failed()
    // {
    //     return Inertia::render('User/Payments/Failed', [
    //         'message' => 'Pembayaran gagal atau dibatalkan.',
    //     ]);
    // }
}
