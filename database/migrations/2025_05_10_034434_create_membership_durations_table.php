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
        Schema::create('membership_durations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: '1 Bulan', '3 Bulan', '1 Tahun'
            $table->integer('months'); // Contoh: 1, 3, 12
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_durations');
    }
};
