<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\Shift;
use App\Models\OperatorVenue;
use App\Models\OperatorAssignment;

class OperatorAssignmentController extends Controller
{
    public function index(Staff $staff)
    {
        return Inertia::render('Merchant/Operator/Index', [
            'staff'          => $staff,
            'venues'         => $this->getVenues($staff->merchant_id),
            'assignedVenues' => $this->getAssignedVenues($staff->id),
            'shifts'         => $this->getShifts($staff->merchant_id),
            'assignments'    => $this->getAssignments($staff->id),
        ]);
    }

    public function store(Request $request, Staff $staff)
    {
        $data = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'shift_id' => 'required|exists:shifts,id',
            'dates'    => 'required|array',
            'dates.*'  => 'date',
        ]);

        $operatorVenue = OperatorVenue::firstOrCreate([
            'staff_id' => $staff->id,
            'venue_id' => $data['venue_id'],
        ]);

        $saved = [];
        $failed = [];

        foreach ($data['dates'] as $date) {
            try {
                $assignment = OperatorAssignment::updateOrCreate(
                    [
                        'operator_venue_id' => $operatorVenue->id,
                        'shift_id'          => $data['shift_id'],
                        'date'              => $date,
                    ],
                    ['is_active' => true]
                );
                $saved[] = $assignment->load('operatorVenue.venue');
            } catch (\Exception $e) {
                Log::error("Gagal simpan assignment: {$e->getMessage()}", [
                    'venue_id' => $data['venue_id'],
                    'shift_id' => $data['shift_id'],
                    'date'     => $date,
                ]);
                $failed[] = $date;
            }
        }

        return response()->json([
            'success'      => true,
            'assignments'  => collect($saved)->map(fn($a) => $this->formatAssignment($a)),
            'failed_dates' => $failed,
        ]);
    }

    public function update(Request $request, Staff $staff, OperatorAssignment $assignment)
    {
        $data = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'shift_id' => 'required|exists:shifts,id',
            'date'     => 'required|date',
        ]);

        $assignment->update([
            'operator_venue_id' => OperatorVenue::firstOrCreate([
                'staff_id' => $staff->id,
                'venue_id' => $data['venue_id'],
            ])->id,
            'shift_id' => $data['shift_id'],
            'date'     => $data['date'],
        ]);

        return response()->json([
            'assignment' => $this->formatAssignment($assignment->load('operatorVenue.venue')),
        ]);
    }

    public function destroy(Staff $staff, OperatorAssignment $assignment)
    {
        $assignment->delete();
        return response()->json(['success' => true]);
    }

    /*
    |--------------------------------------------------------------------------
    | Private Helpers
    |--------------------------------------------------------------------------
    */

    private function getVenues($merchantId)
    {
        return Venue::where('merchant_id', $merchantId)
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    private function getAssignedVenues($staffId)
    {
        return OperatorVenue::where('staff_id', $staffId)
            ->pluck('venue_id')
            ->toArray();
    }

    private function getShifts($merchantId)
    {
        return Shift::where('merchant_id', $merchantId)
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get()
            ->map(fn($s) => [
                'id'        => $s->id,
                'name'      => $s->name,
                'startHour' => (int) date('H', strtotime($s->start_time)),
                'endHour'   => (int) date('H', strtotime($s->end_time)),
            ]);
    }

    private function getAssignments($staffId)
    {
        return OperatorAssignment::with(['operatorVenue.venue:id,name'])
            ->whereHas('operatorVenue', fn($q) => $q->where('staff_id', $staffId))
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($a) => $this->formatAssignment($a));
    }

    private function formatAssignment($a)
    {
        return [
            'id'       => $a->id,
            'date'     => $a->date,
            'shift_id' => $a->shift_id,
            'venue'    => [
                'id'   => $a->operatorVenue->venue->id ?? null,
                'name' => $a->operatorVenue->venue->name ?? null,
            ],
        ];
    }
}
