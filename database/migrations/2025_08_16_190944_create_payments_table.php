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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();

            // cash / transfer / gateway
            $table->enum('payment_method', ['cash', 'transfer', 'gateway'])->nullable();

            // dp / full
            $table->enum('payment_type', ['down_payment', 'full_payment'])->nullable();

            // order id di Midtrans
            $table->string('gateway_order_id')->nullable();

            $table->decimal('amount', 12, 2);

            // pakai status internal yang konsisten
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
