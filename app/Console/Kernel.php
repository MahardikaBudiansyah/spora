<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use App\Services\Membership\MembershipOrderService;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('cart:clear-expired')->daily();
        
        $schedule->command('membership:auto-activate')->daily();
        $schedule->command('membership:auto-expire')->daily();

        $schedule->command('booking:cancel-expired')->everyMinute();

    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
