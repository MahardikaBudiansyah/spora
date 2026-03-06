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
        Schema::create('facility_venue', function (Blueprint $table) {
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();
            $table->foreignId('venue_facility_id')->constrained('venue_facilities')->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['venue_id', 'venue_facility_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_venue');
    }
};
