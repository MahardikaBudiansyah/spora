<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourtTimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courts = Court::all();
        $timeSlots = TimeSlot::all();

        foreach ($courts as $court) {
            $dataToInsert = [];

            foreach ($timeSlots as $slot) {
                $basePrice = 100000;
                $extra = 0;
                
                $hour = (int) substr($slot->start_time, 0, 2);

                if ($hour >= 0 && $hour < 6) {
                    $extra = -20000; 
                } elseif ($hour >= 9 && $hour < 17) {
                    $extra = 20000;
                } elseif ($hour >= 17 && $hour < 22) {
                    $extra = 50000;
                }

                $dataToInsert[] = [
                    'court_id'     => $court->id,
                    'time_slot_id' => $slot->id,
                    'day_type'     => 'weekday',
                    'price'        => $basePrice + $extra,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ];
            }
            
            DB::table('court_time_slot')->insert($dataToInsert);
        }
    }
}
