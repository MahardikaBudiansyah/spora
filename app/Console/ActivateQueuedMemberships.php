<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Membership\MembershipOrderService;

class ActivateQueuedMemberships extends Command
{
    protected $signature = 'membership:auto-activate';
    protected $description = 'Aktifkan membership yang statusnya queued dan sudah mencapai start_date';

    public function handle(MembershipOrderService $membershipOrderService)
    {
        $count = $membershipOrderService->autoActivateQueuedMemberships();
        $this->info("✅ {$count} membership berhasil diaktifkan.");
    }
}
