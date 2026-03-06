<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;

use App\Models\Payment;
use App\Services\Billing\PaymentService;
use App\Http\Controllers\Merchant\Controller;

class BookingController extends Controller
{
    protected $paymentService;

    public function __construct(
        PaymentService $paymentService, 
    ) {
        $this->paymentService = $paymentService;
    }
    

    public function sync(Payment $payment)
    {
        try {
            $this->paymentService->syncWithGateway($payment);
            return back()->with('success', 'Status pembayaran berhasil diperbarui dari Midtrans.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal sinkronisasi: ' . $e->getMessage());
        }
    }
}