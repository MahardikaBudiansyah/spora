<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Services\Booking\BookingService;

class CancelExpiredBookings extends Command
{
    protected $signature = 'booking:cancel-expired';
    protected $description = 'Membatalkan booking yang tidak dibayar dalam batas waktu tertentu';

    public function handle(BookingService $bookingService)
    {
        $expiredBookings = Booking::where('status', 'pending')
            ->where('created_at', '<', now()->subMinutes(30)) 
            ->get();

        $count = 0;
        foreach ($expiredBookings as $booking) {
            $bookingService->handleExpiredBooking($booking);
            $count++;
        }

        $this->info("🧹 {$count} booking kadaluwarsa telah dibatalkan dan kuota dikembalikan.");
    }
}