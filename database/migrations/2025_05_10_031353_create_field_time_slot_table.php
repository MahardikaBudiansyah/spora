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
        Schema::create('field_time_slot', function (Blueprint $table) {
            $table->unsignedBigInteger('field_id');
            $table->unsignedBigInteger('time_slot_id');
            $table->decimal('price', 10, 2);
            $table->timestamps();

            $table->foreign('field_id')->references('id')->on('fields')->onDelete('cascade');
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_time_slot');
    }
};
