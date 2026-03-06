<?php

namespace App\Console\Commands;

use App\Models\Cart;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ClearExpiredCarts extends Command
{
    // Nama command yang akan dipanggil di terminal
    protected $signature = 'cart:clear-expired';

    // Deskripsi singkat command
    protected $description = 'Menghapus data keranjang yang tanggalnya sudah lampau';

    public function handle()
    {
        $today = now()->toDateString();

        $expiredCount = Cart::where('date', '<', $today)->count();

        if ($expiredCount > 0) {
            Cart::where('date', '<', $today)->delete();
            
            $message = "[CART_CLEANUP] Berhasil menghapus {$expiredCount} item keranjang kadaluarsa.";
            $this->info($message);
            Log::info($message);
        } else {
            $this->info("[CART_CLEANUP] Tidak ada item keranjang yang kadaluarsa.");
        }

        return Command::SUCCESS;
    }
}