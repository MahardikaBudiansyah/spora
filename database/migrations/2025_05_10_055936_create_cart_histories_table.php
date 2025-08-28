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
        Schema::create('cart_histories', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('cart_id');
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('field_id');
        $table->unsignedBigInteger('time_slot_id');
        $table->decimal('price', 10, 2);
        $table->enum('status', ['added', 'removed', 'booked', 'expired']);
        $table->dateTime('added_at');
        $table->timestamps();

        $table->foreign('cart_id')->references('id')->on('carts')->onDelete('cascade'); 
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('field_id')->references('id')->on('fields')->onDelete('cascade');
        $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_histories');
    }
};
