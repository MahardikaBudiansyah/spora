<?php

namespace App\Http\Controllers\Merchant;

use App\Events\CourtScheduleUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\CourtScheduleUpdateRequest;
use App\Models\Court;
use App\Models\Venue;
use App\Services\Court\CourtScheduleService;
use Exception;
use Illuminate\Http\Request;
use Log;

class CourtScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(CourtScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function updateCourtSingleSchedule(Request $request, Venue $venue, Court $court)
    {
        $request->validate([
            'status_id'   => ['required', 'exists:court_status_types,id'],
            'date'        => ['required', 'date'],
            'timeslot_id' => ['required', 'exists:time_slots,id'],
        ]);

        try {
            $this->scheduleService->updateSingleSchedule(
                $court,
                $request->timeslot_id,
                $request->date,
                $request->status_id
            );

            return back()->with('success', 'Status slot berhasil diperbarui.');
        } catch (Exception $e) {
            Log::error("Gagal update slot: " . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui slot.');
        }
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
