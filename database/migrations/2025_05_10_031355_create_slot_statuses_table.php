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
        Schema::create('slot_statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('field_id');
            $table->unsignedBigInteger('time_slot_id');
            $table->date('date')->index();
            $table->unsignedBigInteger('status_id');
            $table->timestamps();

            $table->foreign('field_id')->references('id')->on('fields')->onDelete('cascade');
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('slot_status_labels')->onDelete('cascade');

            $table->unique(['field_id', 'time_slot_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slot_statuses');
    }
};
