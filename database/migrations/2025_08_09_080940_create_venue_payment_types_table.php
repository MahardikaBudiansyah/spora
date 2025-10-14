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
        Schema::create('venue_payment_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();

            // full payment selalu tersedia
            $table->boolean('enable_dp')->default(false);

            // aturan DP (hanya berlaku kalau enable_dp = true)
            $table->enum('dp_type', ['fixed', 'percentage'])->nullable();
            $table->decimal('dp_value', 12, 2)->nullable();

            $table->boolean('apply_to_merchant')->default(false);
            $table->integer('full_payment_days_before')->default(1);
            $table->integer('max_full_payment_days')->default(3);  
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_payment_types');
    }
};
