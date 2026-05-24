<?php

namespace App\Services\Billing;

use Exception;
use Carbon\Carbon;
use App\Models\Invoice;
use App\Enums\OrderType;
use App\Models\Booking;
use App\Enums\InvoiceStatus;
use App\Helpers\InvoiceHelper;
use App\Models\MembershipOrder;
use Illuminate\Support\Facades\Log;

class InvoiceService
{
    public function createInvoice(object $order, array $paymentData = []): Invoice
    {
        if (!isset($order->total_price) || !is_numeric($order->total_price)) {
            throw new Exception("Order model must have a valid 'total_price' property.");
        }

        $invoiceNo = InvoiceHelper::generateInvoiceNo();
        $dueDate = $this->calculateDueDate($order, $paymentData);

        $orderType = match (true) {
            $order instanceof Booking => OrderType::BOOKING,
            $order instanceof MembershipOrder => OrderType::MEMBERSHIP,
            default => throw new Exception("Unknown order class: " . get_class($order))
        };

        $invoice = Invoice::create([
            'order_type'   => $orderType,
            'order_id'     => $order->id,
            'invoice_no'   => $invoiceNo,
            'total_amount' => $order->total_price,
            'status'       => InvoiceStatus::UNPAID,
            'due_date'     => $dueDate,
        ]);

        Log::info('[INVOICE_CREATED]', [
            'type'         => $orderType->label(),
            'order_id'     => $order->id,
            'invoice_no'   => $invoiceNo,
            'due_date'     => $dueDate->toDateTimeString(),
        ]);

        return $invoice;
    }

    private function getMaxPaymentDays(object $order): int
    {
        $venue = null;
        $type = null;

        if ($order instanceof MembershipOrder) {
            $venue = $order->venue;
            $type = OrderType::MEMBERSHIP;
        } elseif ($order instanceof Booking) {
            $venue = $order->venue;
            $type = OrderType::BOOKING;
        }

        if (!$venue || !$type) {
            Log::warning('[INVOICE_POLICY_NOT_FOUND]', ['order_type' => get_class($order)]);
            return 3;
        }

        $policy = $venue->getPolicyFor($type);

        return $policy->max_full_payment_days ?? 3;
    }

    private function calculateDueDate(object $order, array $paymentData): Carbon
    {
        if (isset($paymentData['due_date'])) {
            return $paymentData['due_date'] instanceof Carbon
                ? $paymentData['due_date']
                : Carbon::parse($paymentData['due_date']);
        }

        if ($order instanceof Booking) {
            $earliestSlot = $order->details()->min('booking_date');

            $standardExpiry = now()->addMinutes(30);
            $limitBeforePlay = Carbon::parse($earliestSlot)->subMinutes(15);

            return $standardExpiry->lessThan($limitBeforePlay) ? $standardExpiry : $limitBeforePlay;
        }

        $maxDays = $this->getMaxPaymentDays($order);
        return now()->addDays($maxDays);
    }

    public function markAsPaid(Invoice $invoice): void
    {
        $invoice->update([
            'status' => InvoiceStatus::PAID,
        ]);

        Log::info("[INVOICE_PAID] Invoice #{$invoice->invoice_no} marked as paid.");
    }
}
