<?php

namespace App\Services\Billing\Gateways;

use stdClass;
use Carbon\Carbon;
use Midtrans\Snap;
use Midtrans\Config;
use Midtrans\CoreApi;
use Midtrans\Transaction;
use Midtrans\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createTransaction(array $params)
    {
        return CoreApi::charge($params);
    }

    public function createSnapToken(array $params)
    {
        return Snap::createTransaction($params);
    }

    public function parseNotification(Request $request): stdClass
    {
        $notification = new Notification(); 
        $output = json_decode($request->getContent()); 
        if (!$output) {
            $output = new stdClass();
        }
        
        $serverKey = config('services.midtrans.server_key');
        $signature = hash('sha512', $notification->order_id . $notification->status_code . $notification->gross_amount . $serverKey);
        
        if ($notification->signature_key !== $signature) {
            throw new \Exception("Midtrans Signature Mismatch");
        }

        $output->order_id = $notification->order_id;
        $output->transaction_status = $notification->transaction_status;
        $output->gross_amount = $notification->gross_amount;

        $isSettled = in_array($output->transaction_status, ['settlement', 'capture']);
        
        $output->payment_details = [
            'payment_provider' => 'midtrans', 
            'payment_channel'  => $output->payment_type ?? null,
            'reference_no'     => $output->transaction_id ?? null,
            'payment_date'     => $isSettled ? Carbon::parse($output->settlement_time ?? $output->transaction_time ?? now()) : null,
            'raw_response'     => json_encode($output),
        ];

        return $output; 
    }

    public function checkStatus(string $gatewayOrderId): stdClass
    {
        $status = Transaction::status($gatewayOrderId);
        
        return json_decode(json_encode($status));
    }
}
