<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Services\MidtransService;
use Illuminate\Support\Facades\Log;
use App\Services\Billing\PaymentService;

class MidtransCallbackController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function callback(Request $request)
    {
        $rawJson = $request->getContent();
        $data = json_decode($rawJson, true);

        // 1. Validasi signature
        $serverKey = config('services.midtrans.server_key');
        $signature = hash('sha512',
            $request->order_id .
            $request->status_code .
            $request->gross_amount .
            $serverKey
        );

        if ($request->signature_key !== $signature) {
            Log::warning('Midtrans signature mismatch', $request->all());
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Proses callback
        $payment = $this->paymentService->handleGatewayCallback($request);

        if (!$payment) {
            Log::error('Midtrans callback: Payment not found', $request->all());
            return response()->json(['message' => 'Payment not found'], 404);
        }
        
        // 3. Log hasil
        Log::info('Midtrans callback processed', [
            'order_id' => $request->order_id,
            'status'   => $payment->payment_status,
        ]);

        // 4. Return sukses ke Midtrans
        return response()->json(['message' => 'OK'], 200);
    }
}
