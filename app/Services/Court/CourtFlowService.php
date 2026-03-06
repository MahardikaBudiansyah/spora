<?php
namespace App\Services\Court;

use App\Models\Court;
use App\Models\Venue;
use Illuminate\Support\Facades\DB;
use App\Services\Court\CourtService;
use App\Services\Court\CourtScheduleService;

class CourtFlowService
{
    protected $courtService;
    protected $scheduleService;

    public function __construct(CourtService $courtService, CourtScheduleService $scheduleService)
    {
        $this->courtService = $courtService;
        $this->scheduleService = $scheduleService;
    }

    public function createCourtWithPricing(Venue $venue, array $data)
    {
        return DB::transaction(function () use ($venue, $data) {
            $court = $this->courtService->store($venue, $data);

            $this->scheduleService->syncMasterPrices($court, $data['timeSlots'], $data['prices']);

            return $court;
        });
    }

    public function updateCourtWithPricing(Court $court, array $data)
    {
        return DB::transaction(function () use ($court, $data) {
            $this->courtService->update($court, $data);

            $this->scheduleService->syncMasterPrices($court, $data['timeSlots'], $data['prices']);

            return $court;
        });
    }
}