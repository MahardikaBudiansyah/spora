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
        Schema::create('payment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();

            // provider (midtrans, bca, mandiri, dll)
            $table->string('payment_provider')->nullable();

            // channel (qris, va, gopay, indomaret, dll)
            $table->string('payment_channel')->nullable();

            // nomor referensi (transaction_id / VA number)
            $table->string('reference_no')->nullable();

            // nama pembayar / nama bank / store
            $table->string('payer_name')->nullable();

            // tanggal aktual pembayaran
            $table->timestamp('payment_date')->nullable();

            // bukti transfer manual
            $table->string('proof_of_payment')->nullable();

            // simpan raw log response dari gateway
            $table->json('raw_response')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_details');
    }
};
