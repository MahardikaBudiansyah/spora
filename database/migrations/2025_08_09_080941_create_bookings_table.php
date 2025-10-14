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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('order_no')->unique();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->foreignId('venue_payment_type_id') // tambahkan ini
                ->nullable()
                ->constrained('venue_payment_types')
                ->nullOnDelete();
            $table->foreignId('operator_assignment_id')
                ->nullable()
                ->constrained('operator_assignments')
                ->nullOnDelete();

            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->decimal('total_original_price', 12, 2)->nullable();
            $table->decimal('total_discount', 12, 2)->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->string('slug', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
