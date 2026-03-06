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
        Schema::create('venue_payment_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->string('order_type');

            $table->boolean('enable_dp')->default(false);
            $table->enum('dp_type', ['fixed', 'percentage'])->nullable();
            $table->decimal('dp_value', 12, 2)->nullable();
            $table->integer('full_payment_days_before')->default(1);
            $table->integer('max_full_payment_days')->default(3);

            $table->boolean('enable_refund')->default(false);
            $table->decimal('refund_percentage', 5, 2)->default(0);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['venue_id', 'order_type']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_payment_policies');
    }
};
