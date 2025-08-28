<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function store(Request $request)
    {
        $merchantId = auth('merchant')->id();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => ['required','date_format:H:i', function($attribute, $value) use ($request){
                if($value === $request->start_time){
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        $attribute => ['End time tidak boleh sama dengan start time.']
                    ]);
                }
            }],
        ]);

        $shift = Shift::create([
            'merchant_id' => $merchantId,
            'name' => $validated['name'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json($shift, 201);
    }

    public function destroy(Shift $shift)
    {
        $shift->delete(); // gunakan soft delete di model Shift

        return response()->json(['success' => true]);
    }
}
