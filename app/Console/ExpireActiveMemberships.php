<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Membership\MembershipOrderService;

class ExpireActiveMemberships2 extends Command
{
    protected $signature = 'membership:auto-expire';
    protected $description = 'Menandai membership yang sudah melewati end_date menjadi expired';

    public function handle(MembershipOrderService $membershipOrderService)
    {
        $count = $membershipOrderService->autoExpireMemberships();

        $this->info("🕓 {$count} membership berhasil diubah menjadi expired.");
    }
}
