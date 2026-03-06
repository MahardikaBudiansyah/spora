<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        try {
            $payment = $this->paymentService->handleGatewayCallback($request, 'midtrans');

            Log::info('Midtrans callback processed', [
                'order_id' => $request->order_id,
                'status'   => $payment->payment_status,
            ]);

            return response()->json(['message' => 'OK'], 200);
        } catch (\Throwable $e) {
            Log::error('Midtrans callback failed', [
                'order_id' => $request->order_id,
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }
}
