<?php
namespace App\Http\Controllers\Merchant;

use Log;
use Exception;
use App\Models\Court;
use App\Models\Venue;
use App\Models\CourtSchedule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Events\CourtScheduleUpdated;
use App\Services\Court\CourtScheduleService;
use App\Http\Requests\Merchant\CourtScheduleUpdateRequest;

class CourtScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(CourtScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function updateCourtSchedules(CourtScheduleUpdateRequest $request, Venue $venue, Court $court)
    {
        try {
            $this->scheduleService->updateSchedules($court, $request->validated());

            CourtScheduleUpdated::dispatch(
                $court->id, 
                $request->timeslot_ids, 
                $request->date, 
                $request->status_id, 
                $venue->id
            );

            return redirect()->back()->with('success', 'Jadwal harian berhasil diperbarui.');
        } catch (Exception $e) {
            Log::error("Gagal update jadwal: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui jadwal.');
        }
    }
}