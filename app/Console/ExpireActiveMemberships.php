<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Membership\MembershipService;

class ExpireActiveMemberships extends Command
{
    protected $signature = 'membership:auto-expire';
    protected $description = 'Menandai membership yang sudah melewati end_date menjadi expired';

    public function handle(MembershipService $membershipService)
    {
        $count = $membershipService->autoExpireMemberships();

        $this->info("🕓 {$count} membership berhasil diubah menjadi expired.");
    }
}
