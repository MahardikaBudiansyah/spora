<?php

namespace App\Services\Billing;

use stdClass;
use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Services\Billing\Gateways\XenditService;
use App\Services\Billing\Gateways\MidtransService;

class PaymentGatewayService
{
    protected MidtransService $midtransService;
    protected XenditService $xenditService;
    protected string $defaultGateway;

    public function __construct (
        MidtransService $midtransService, 
        XenditService $xenditService
    ){
        $this->midtransService = $midtransService;
        $this->xenditService = $xenditService;
        $this->defaultGateway = config('services.payment.default', 'midtrans');
    }

    public function getDefaultGatewayName(): string
    {
        return $this->defaultGateway;
    }

    public function createTransaction(Invoice $invoice, array $userData, string $gatewayOrderId, ?string $gatewayName = null): array
    {
        $gateway = $gatewayName ?? $this->defaultGateway;

        if ($gateway === 'midtrans') {
            $params = $this->mapInvoiceToMidtransParams($invoice, $userData, $gatewayOrderId); 
            
            $response = $this->midtransService->createSnapToken($params);
            
            return [
                'gateway' => 'midtrans',
                'order_id' => $gatewayOrderId, 
                'snap_token' => $response->token, 
                'redirect_url' => $response->redirect_url,
            ];
        }

        if ($gateway === 'xendit') {
            $params = $this->mapInvoiceToXenditParams($invoice, $userData, $gatewayOrderId);
            $xenditInvoice = $this->xenditService->createInvoice($params);
            
            return [
                'gateway' => 'xendit',
                'order_id' => $gatewayOrderId,
                'snap_token' => null,
                'redirect_url' => $xenditInvoice['invoice_url'] ?? null, 
            ];
        }
        
        throw new \Exception("Gateway '{$gateway}' tidak didukung.");
    }

    public function checkStatus(string $gatewayOrderId, string $gatewayName = 'midtrans'): stdClass
    {
        if ($gatewayName === 'midtrans') {
            return $this->midtransService->checkStatus($gatewayOrderId);
        }
        
        if ($gatewayName === 'xendit') {
            return $this->xenditService->checkStatus($gatewayOrderId);
        }
        
        throw new \Exception("Gateway '{$gatewayName}' tidak didukung.");
    }
    
    private function mapInvoiceToMidtransParams(Invoice $invoice, array $userData, string $gatewayOrderId): array
    {
        return [
            'transaction_details' => [
                'order_id' => $gatewayOrderId,
                'gross_amount' => $invoice->total_amount,
            ],
            'customer_details' => $userData,
            'item_details' => [
                [
                    'id' => $invoice->order_id,
                    'price' => $invoice->total_amount,
                    'quantity' => 1,
                    'name' => 'Pembayaran ' . $invoice->order_type->label(), 
                ]
            ],
        ];
    }

    private function mapInvoiceToXenditParams(Invoice $invoice, array $userData, string $gatewayOrderId): array
    {
        $orderType = strtolower($invoice->order_type->value ?? $invoice->order_type);
        
        $params = [
            'external_id' => $gatewayOrderId,
            'amount' => $invoice->total_amount,
            'description' => 'Pembayaran ' . $invoice->order_type->label() . ' #' . $invoice->invoice_no,
            'customer' => [
                'given_names' => $userData['name'] ?? 'Customer',
                'email' => $userData['email'] ?? null,
                'mobile_number' => $userData['phone_number'] ?? null,
            ],
            'success_redirect_url' => route('user.payment.success', [
                'type' => $orderType,
                'orderId' => $gatewayOrderId
            ]),
            'failure_redirect_url' => route('user.payment.failed'),
            'currency' => 'IDR',
        ];

        if ($invoice->venue && $invoice->venue->merchant->xendit_sub_account_id) {
            $params['for-user-id'] = $invoice->venue->merchant->xendit_sub_account_id;
            
        }

        return $params;
    }
    
    public function handleNotification(Request $request, string $gatewayName): stdClass
    {
        if ($gatewayName === 'midtrans') {
            return $this->midtransService->parseNotification($request); 
        }

        if ($gatewayName === 'xendit') {
            return $this->xenditService->parseNotification($request);
        }
        
        throw new \Exception("Gateway '{$gatewayName}' tidak didukung untuk notifikasi.");
    }
}