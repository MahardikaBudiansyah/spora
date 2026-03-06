<?php

namespace App\Services\Membership;

use Carbon\Carbon;
use App\Models\Admin;
use App\Models\Staff;
use App\Models\Venue;

use App\Models\Merchant;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\MembershipCard;
use App\Enums\NotificationType;
use App\Models\MembershipOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Enums\MembershipOrderStatus;
use App\Services\Billing\InvoiceService;
use App\Services\Billing\PaymentService;
use App\Services\System\NotificationService;
use App\Services\Membership\MembershipCardService;

class MembershipOrderFlowService
{
    protected MembershipCardService $membershipCardService;
    protected MembershipOrderService $orderService;
    protected InvoiceService $invoiceService;
    protected PaymentService $paymentService;
    protected NotificationService $notificationService;

    public function __construct(
        MembershipCardService $membershipCardService,
        MembershipOrderService $orderService,
        InvoiceService $invoiceService,
        PaymentService $paymentService,
        NotificationService $notificationService,
    ) {
        $this->membershipCardService = $membershipCardService;
        $this->orderService = $orderService;
        $this->invoiceService = $invoiceService;
        $this->paymentService = $paymentService;
        $this->notificationService = $notificationService;
    }

    public function handleOfflineMembershipOrder(array $input, Venue $venue, int $packageId): MembershipOrder
    {
        Log::info('[MEMBERSHIP][FLOW_START]', ['type' => 'OFFLINE', 'venue_id' => $venue->id]);

        if (!empty($input['customer_id'])) {
            $this->validateAvailability($venue->id, $input['customer_id'], Carbon::parse($input['start_date']));
        }

        $customerData = [
            'user_id'      => $input['customer_id'] ?? null,
            'name'         => $input['customer_name'],
            'phone_number' => $input['customer_phone'],
            'email'        => $input['customer_email'] ?? null,
            'start_date'   => Carbon::parse($input['start_date'], 'Asia/Jakarta')->startOfDay(),
        ];

        $paymentData = $this->formatPaymentData($input);

        return DB::transaction(function () use ($customerData, $venue, $packageId, $paymentData) {
            $card = $this->membershipCardService->getOrCreateCard($venue->id, $customerData);

            $orderData = [
                'venue_id'   => $venue->id,
                'package_id' => $packageId,
                'start_date' => $customerData['start_date'],
                'operator_assignment_id' => null,
            ];

            $order = $this->orderService->createOrder($orderData, $card);
            
            $invoice = $this->invoiceService->createInvoice($order, $paymentData);

            $paymentData['is_merchant_input'] = true; 
            $paymentData['payment_status'] = PaymentStatus::PAID;
            $this->paymentService->createPayment($invoice, $paymentData);

            if ($paymentData['amount'] >= $order->total_price) {
                $today = now()->startOfDay();
                $startDate = Carbon::parse($order->start_date)->startOfDay();

                $newStatus = $startDate->greaterThan($today) 
                    ? MembershipOrderStatus::QUEUED 
                    : MembershipOrderStatus::ACTIVE;
                    
                $order->update(['status' => $newStatus]);

                if ($order->membershipCard->user) {
                    $this->notificationService->send(
                        $order->membershipCard->user,
                        NotificationType::PAYMENT_SUCCESS,
                        [
                            'order_no' => $order->order_no,
                            'message' => "Pembayaran membership {$order->package_name_snapshot} berhasil."
                        ]
                    );
                }

                if ($venue->merchant) {
                    $this->notificationService->send(
                        $venue->merchant, 
                        NotificationType::MEMBERSHIP_ACTIVATED,
                        [
                            'message' => "Member Baru: {$order->member_name_snapshot} telah bergabung di {$venue->name}.",
                            'order_no' => $order->order_no
                        ]
                    );
                }

                $platformAdmins = Admin::where('is_active', true)->get();
                foreach ($platformAdmins as $admin) {
                    $this->notificationService->send(
                        $admin, 
                        NotificationType::MEMBERSHIP_ACTIVATED,
                        [
                            'message' => "Member Baru: {$order->member_name_snapshot} telah bergabung di {$venue->name} (Merchant: {$venue->merchant->name}).",
                            'order_no' => $order->order_no
                        ]
                    );
                }
            }

            return $order;
        });
    }

    public function handleOnlineMembershipOrder(int $userId, array $orderInput, array $paymentData): array
    {
        Log::info('[MEMBERSHIP][FLOW_START]', ['type' => 'ONLINE', 'user_id' => $userId]);
        
        $this->validateAvailability($orderInput['venue_id'], $userId, now());
        
        return DB::transaction(function () use ($userId, $orderInput, $paymentData) {
            $card = $this->membershipCardService->getOrCreateCardForUser(
                userId: $userId,
                venueId: $orderInput['venue_id'],
                name: $orderInput['name'],
                phone: $orderInput['phone_number'],
                email: $orderInput['email'],
            );

            $lastActiveOrder = $card->orders()
                ->whereIn('status', [MembershipOrderStatus::ACTIVE, MembershipOrderStatus::QUEUED])
                ->orderBy('end_date', 'desc')
                ->first();

            $calculatedStartDate = $lastActiveOrder 
                ? Carbon::parse($lastActiveOrder->end_date)->addDay() 
                : now();

            $orderData = [
                'venue_id'   => $orderInput['venue_id'],
                'user_id'    => $card->user_id,
                'name'       => $card->name,
                'package_id' => $orderInput['package_id'],
                'qty'        => $orderInput['qty'] ?? 1,
                'discount'   => 0, 
                'start_date' => $calculatedStartDate,
            ];

            $order = $this->orderService->createOrder($orderData, $card);

            $invoicePaymentData = [
                'payment_type' => $orderInput['payment']['type'] ?? 'full_payment',
            ];

            $invoice = $this->invoiceService->createInvoice($order, $invoicePaymentData);

            $gatewayData = $this->paymentService->createOnlineTransaction(
                $invoice, 
                $this->mapOrderToCustomerData($order),
                $paymentData['gateway_name'] ?? null 
            );
            
            Log::info('[MEMBERSHIP][ONLINE_GATEWAY_CREATED]', ['gateway' => $gatewayData['gateway'] ?? 'unknown']);
            
            if ($order->user_id) { 
                $this->notificationService->send(
                    $card->user,
                    NotificationType::PAYMENT_REMINDER,
                    [
                        'order_no' => $order->order_no,
                        'message' => "Pesanan membership {$order->package_name_snapshot} berhasil dibuat.",
                        'payment_url' => $gatewayData['redirect_url'] ?? null 
                    ]
                );
            }

            return [
                'order' => $order,
                'gateway_data' => $gatewayData, 
            ];
        });
    }

    private function formatPaymentData(array $input): array
    {
        $methodRaw = $input['payment_method'] ?? 'cash';
        
        $paymentDateTime = Carbon::parse(
            ($input['payment_date'] ?? now()->toDateString()) . ' ' . 
            ($input['payment_time'] ?? now()->format('H:i')), 
            'Asia/Jakarta'
        );

        return [
            'payment_type'     => 'full_payment',
            'payment_method' => match ($methodRaw) {
                'bank_transfer', 'ewallet' => PaymentMethod::TRANSFER,
                'qris' => PaymentMethod::QRIS,
                'cash' => PaymentMethod::CASH,
                default => PaymentMethod::OTHER,
            },
            'payment_channel'  => $methodRaw,
            'payment_provider' => $input['bank'] ?? $input['digital_wallet'] ?? ($methodRaw === 'qris' ? 'qris' : null),
            'amount'           => $input['amount'] ?? 0,
            'reference_no'     => $input['reference_no'] ?? null,
            'payer_name'       => $input['payer_name'] ?? null,
            'payment_date'     => $paymentDateTime,
            'proof_of_payment' => request()->file('proof_of_payment'), 
        ];
    }

    public function validateAvailability(int $venueId, ?int $userId, Carbon $startDate)
    {
        if (!$userId) return;

        $existingOrdersCount = MembershipOrder::whereHas('membershipCard', function($q) use ($userId, $venueId) {
                $q->where('user_id', $userId)->where('venue_id', $venueId);
            })
            ->whereIn('status', [
                MembershipOrderStatus::ACTIVE, 
                MembershipOrderStatus::QUEUED,
                MembershipOrderStatus::PENDING 
            ])
            ->count();

        if ($existingOrdersCount >= 3) {
            $message = request()->is('api/*')
                ? "Anda sudah memiliki 3 paket membership aktif/antrean."
                : "Customer sudah memiliki 3 paket aktif/antrean. Tidak dapat menambah paket lagi.";
                
            throw new \Exception($message);
        }
    }

    private function mapOrderToCustomerData(MembershipOrder $order): array
    {
        $card = $order->membershipCard;
        $user = $card?->user;

        return [
            'name' => $order->member_name_snapshot 
                    ?? $card->name 
                    ?? $user?->name 
                    ?? 'Member',

            'email' => $order->email_snapshot 
                    ?? $card->email 
                    ?? $user?->email 
                    ?? 'customer@example.com',

            'phone_number' => $order->phone_number_snapshot
                            ?? $card->phone_number 
                            ?? $user?->phone_number 
                            ?? null,
        ];
    }
}