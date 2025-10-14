<?php

namespace App\Services\Billing;

use App\Models\Invoice;
use App\Helpers\InvoiceHelper;

class InvoiceService
{
    /**
     * Buat invoice
     *
     * @param  mixed $model    Model yang punya relasi invoices (Booking, dsb)
     * @param  float $totalAmount
     * @param  string $status
     * @param  \DateTime|null $dueDate
     * @return Invoice
     */
    public function createInvoice($model, float $totalAmount, string $status = 'unpaid', ?\DateTime $dueDate = null): Invoice
    {
        return $model->invoice()->create([
            'invoice_no'   => InvoiceHelper::generateInvoiceNo(),
            'total_amount' => $totalAmount,
            'status'       => $status,
            'due_date'     => $dueDate,
        ]);
    }
}
