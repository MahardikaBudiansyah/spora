<?php
namespace App\Http\Controllers\Merchant;

use App\Models\Court;
use App\Models\Venue;
use App\Models\CourtSchedule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\Court\CourtScheduleService;
use App\Http\Requests\Merchant\CourtTimeSlotUpdateRequest;

class CourtTimeSlotController extends Controller
{
    protected $scheduleService; 

    public function __construct(CourtScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function updateCourtTimeSlots(CourtTimeSlotUpdateRequest $request, Venue $venue, Court $court)
    {
        try {
            $this->scheduleService->syncMasterPrices(
                $court, 
                $request->validated('timeSlots'), 
                $request->validated('prices')
            );

            return redirect()->back()->with('success', 'Harga master berhasil diperbarui.');
        } catch (\Exception $e) {
            \Log::error("Gagal updateCourtTimeSlots: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui harga master.');
        }
    }
}