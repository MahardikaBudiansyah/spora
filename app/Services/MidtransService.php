<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\CoreApi;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createSnapToken(array $params)
    {
        return Snap::getSnapToken($params);
    }

    public function createTransaction(array $params)
    {
        return CoreApi::charge($params);
    }

    public function parseNotification($request)
    {
        // Midtrans SDK sudah otomatis ambil payload dan validasi
        return new Notification();
    }
}
