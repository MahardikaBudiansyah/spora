<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\Operator;
use Illuminate\Http\Request;
use App\Models\OperatorAssignment;
use App\Models\OperatorVenue;

class OperatorAssignmentController extends Controller
{

    public function index(Staff $staff)
    {
        // 1. Ambil semua venue milik merchant
        $venues = Venue::where('merchant_id', $staff->merchant_id)
                        ->orderBy('name')
                        ->get();

        // 2. Ambil semua penugasan operator ini dari pivot table
        $assignedVenues = OperatorVenue::where('staff_id', $staff->id)
                            ->pluck('venue_id')
                            ->toArray();

        // 3. Ambil assignments lengkap dengan relasi (opsional jika mau tampil di table)
        $assignments = OperatorAssignment::with([
                            'operatorVenue.venue',
                            'operatorVenue.staff'
                        ])
                        ->whereHas('operatorVenue', function ($query) use ($staff) {
                            $query->where('staff_id', $staff->id);
                        })
                        ->get();

        return Inertia::render('Merchant/Operator/Index', [
            'staff' => $staff,
            'venue' => $venues,             // Semua venue untuk modal checkbox
            'assignedVenues' => $assignedVenues, // preselected checkbox
            'assignments' => $assignments,  // opsional, bisa ditampilkan di table
        ]);
    }


    public function storeVenue(Request $request, Staff $staff)
    {
        $request->validate([
            'venues' => 'required|array',
            'venues.*' => 'exists:venues,id',
        ]);

        $venueIds = $request->venues;

        // Hapus venue lama yang tidak dipilih lagi
        OperatorVenue::where('staff_id', $staff->id)
            ->whereNotIn('venue_id', $venueIds)
            ->delete();

        // Tambah / update venue baru
        foreach ($venueIds as $venueId) {
            OperatorVenue::updateOrCreate([
                'staff_id' => $staff->id,
                'venue_id' => $venueId,
            ]);
        }

        return back()->with('success', 'Venue assignment updated.');
    }


}
