<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadFileHelper
{
    /**
     * Handle upload file untuk invoice (bukti pembayaran atau invoice file).
     *
     * @param UploadedFile $file
     * @param int $invoiceId
     * @param string $type 'payment-proof' atau 'invoice'
     * @param int|null $paymentDetailId
     * @return string path relatif file untuk disimpan di database
     */
    public static function handleInvoiceFile(UploadedFile $file, int $invoiceId, string $type = 'payment-proof', ?int $paymentDetailId = null): string
    {
        $ext = $file->getClientOriginalExtension();
        $random = mt_rand(100000, 999999);

        if ($type === 'payment-proof' && $paymentDetailId) {
            $filename = "payment-proof-{$paymentDetailId}-{$random}.{$ext}";
        } else {
            $filename = "invoice-{$invoiceId}-{$random}.{$ext}";
        }

        $path = $file->storeAs("uploads/invoices/{$invoiceId}", $filename, 'public');

        return $path;
    }

    /**
     * Delete file dari storage
     *
     * @param string $path
     * @return void
     */
    public static function deleteFile(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
