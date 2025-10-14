<?php

namespace Database\Seeders;

use App\Models\Field;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldTimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = Field::all();
        $timeSlots = TimeSlot::all();

        foreach ($fields as $field) {
            foreach ($timeSlots as $slot) {
                $basePrice = 100000; // harga dasar
                $extra = 0;

                if (in_array($slot->name, [
                    '00:00 - 01:00',
                    '01:00 - 02:00',
                    '02:00 - 03:00',
                    '03:00 - 04:00',
                    '04:00 - 05:00',
                    '05:00 - 06:00',
                ])) {
                    $extra = -20000; // diskon subuh
                } elseif (in_array($slot->name, [
                    '09:00 - 10:00',
                    '10:00 - 11:00',
                    '11:00 - 12:00',
                    '12:00 - 13:00',
                    '13:00 - 14:00',
                    '14:00 - 15:00',
                    '15:00 - 16:00',
                    '16:00 - 17:00',
                ])) {
                    $extra = 20000; // jam siang sedikit lebih mahal
                } elseif (in_array($slot->name, [
                    '17:00 - 18:00',
                    '18:00 - 19:00',
                    '19:00 - 20:00',
                    '20:00 - 21:00',
                    '21:00 - 22:00',
                ])) {
                    $extra = 50000; // prime time sore - malam
                }

                DB::table('field_time_slot')->insert([
                    'field_id' => $field->id,
                    'time_slot_id' => $slot->id,
                    'price' => $basePrice + $extra,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
