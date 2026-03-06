<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('court_time_slot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('court_id')->constrained('courts')->cascadeOnDelete();
            $table->foreignId('time_slot_id')->constrained('time_slots')->cascadeOnDelete();
            
            $table->enum('day_type', ['weekday', 'weekend', 'holiday'])->default('weekday');
            
            $table->decimal('price', 12, 2);
            $table->timestamps();

            $table->unique(['court_id', 'time_slot_id', 'day_type'], 'court_slot_day_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('court_time_slot');
    }
};
