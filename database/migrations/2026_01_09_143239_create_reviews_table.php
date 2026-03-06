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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('court_id')->constrained()->onDelete('cascade');
            
            // Booking ID dibuat UNIQUE agar 1 transaksi hanya bisa di-review 1 kali
            $table->foreignId('booking_id')->unique()->constrained()->onDelete('cascade');

            $table->integer('venue_rating'); // 1-5 (Required saat submit)
            $table->integer('court_rating'); // 1-5 (Required saat submit)
            
            $table->text('comment')->nullable(); // Komentar boleh kosong
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
