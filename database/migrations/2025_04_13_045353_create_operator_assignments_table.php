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
        Schema::create('operator_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operator_venue_id')->constrained('operator_venues')->cascadeOnDelete();
            $table->foreignId('shift_id')->constrained('shifts')->cascadeOnDelete();
            $table->date('date'); 
            $table->boolean('is_active')->default(false);

            $table->timestamps();

            $table->unique(['operator_venue_id','shift_id', 'date']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operator_assignments');
    }
};
