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
        Schema::create('membership_benefits', function (Blueprint $table) {
        $table->id();
        $table->string('name');  // Nama benefit (misal: Diskon 10%, Akses VIP)
        $table->text('description')->nullable();  // Deskripsi tentang benefit tersebut
        $table->enum('discount_type', ['percentage', 'fixed']);  // Jenis diskon: persentase atau nominal tetap
        $table->decimal('discount_value', 10, 2);  // Nilai diskon (persentase atau nominal tetap)
        $table->boolean('booking_priority')->default(false); // Apakah punya prioritas booking
        $table->integer('booking_advance_days')->nullable(); // Berapa hari sebelumnya boleh booking
        $table->integer('monthly_discount_booking_limit')->nullable(); 
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_benefits');
    }
};
