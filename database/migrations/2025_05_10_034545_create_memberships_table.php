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
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->string('order_no')->unique();

            // ini sudah foreign key + index otomatis
            $table->foreignId('membership_user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_package_id')->constrained()->cascadeOnDelete();

            $table->decimal('total_price', 12, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('remaining_discount_limits')->nullable(); 

            // status sering dipakai filter → bisa ditambah index manual
            $table->enum('status', ['pending', 'active', 'expired', 'cancelled'])->default('active')->index();
            $table->boolean('is_queued')->default(false);
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
        Schema::dropIfExists('memberships');
    }
};
