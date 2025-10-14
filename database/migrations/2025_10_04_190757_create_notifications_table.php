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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Polymorphic relation untuk multi-guard
            $table->morphs('notifiable'); // membuat notifiable_type & notifiable_id

            $table->string('source')->default('platform'); // platform sendiri, midtrans, twilio, dll
            $table->string('type'); // tipe notifikasi, misal: 'booking_created', 'payment_success'
            $table->json('data')->nullable(); // data tambahan terkait notifikasi
            $table->timestamp('read_at')->nullable(); // tanda sudah dibaca
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
