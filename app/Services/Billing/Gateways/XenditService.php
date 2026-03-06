<?php

namespace App\Services\Billing\Gateways;

use stdClass;
use Carbon\Carbon;
use Xendit\Configuration;
use Illuminate\Http\Request;
use Xendit\Invoice\InvoiceApi;
use Xendit\Customer\CustomerApi;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Xendit\Customer\CustomerRequest;
use Xendit\Invoice\CreateInvoiceRequest;

class XenditService
{
    public function __construct()
    {
        $key = config('services.xendit.secret_key');
        if (empty($key)) {
            Log::error("Xendit Secret Key is missing!");
        }
        Configuration::setXenditKey($key);
    }
    
    public function createSubAccount(array $data)
    {
        $key = config('services.xendit.secret_key');
        
        $normalizedPhone = isset($data['mobile_number']) 
            ? NumberPhoneHelper::normalize($data['mobile_number']) 
            : null;

        $response = \Illuminate\Support\Facades\Http::withBasicAuth($key, '')
            ->post('https://api.xendit.co/customers', [
                'reference_id'  => (string) $data['external_id'],
                'type'          => 'BUSINESS',
                'email'         => $data['email'],
                'mobile_number' => $normalizedPhone, 
                'business_detail' => [
                    'business_name' => (string) $data['business_name']
                ]
            ]);

        if ($response->successful()) {
            return [
                'id' => $response->json('id')
            ];
        }

        $errorData = $response->json();
        $message = $errorData['message'] ?? 'Terjadi kesalahan pada API Xendit';
        
        throw new \Exception($message);
    }

    public function createInvoice(array $params, string $subAccountId = null)
    {
        $apiInstance = new InvoiceApi();
        $createInvoiceRequest = new CreateInvoiceRequest($params);
        return $apiInstance->createInvoice($createInvoiceRequest, $subAccountId);
    }

    public function checkStatus(string $invoiceId): stdClass
    {
        $apiInstance = new InvoiceApi();
        $status = $apiInstance->getInvoiceById($invoiceId);
        
        $response = new stdClass();
        $response->id = $status->getId();
        $response->status = $status->getStatus();
        $response->external_id = $status->getExternalId();
        $response->amount = $status->getAmount();
        
        return $response;
    }

    public function parseNotification(Request $request): stdClass
    {
        $callbackToken = config('services.xendit.callback_token');
        $xIncomingToken = $request->header('x-callback-token');

        if ($callbackToken && ($xIncomingToken !== $callbackToken)) {
            throw new \Exception("Xendit Callback Token Mismatch");
        }

        $output = json_decode($request->getContent());
        if (!$output) {
            throw new \Exception("Failed to decode Xendit payload.");
        }

        $isSettled = in_array($output->status, ['PAID', 'SETTLED']);

        $response = new stdClass();
        
        $response->order_id = $output->external_id; 
        $response->transaction_status = $output->status;
        $response->gross_amount = $output->amount;
        
        $response->payment_method = $output->payment_method ?? null; 
        $response->payment_channel = $output->payment_channel ?? null;
        $response->payment_id = $output->payment_id ?? $output->id ?? null; 
        $response->transaction_id = $output->id ?? null; 
        
        $response->payment_details = [
            'payment_provider' => 'xendit',
            'payment_channel'  => $output->payment_channel ?? $output->payment_method ?? 'unknown',
            'reference_no'     => $output->id ?? null,
            'payment_date'     => $isSettled ? Carbon::parse($output->paid_at ?? now()) : null,
            'raw_response'     => json_encode($output),
        ];

        return $response;
    }
}