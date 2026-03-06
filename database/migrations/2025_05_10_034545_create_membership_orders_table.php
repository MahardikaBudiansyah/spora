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
        Schema::create('membership_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_no')->unique();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->foreignId('venue_payment_policy_id')->nullable()->constrained('venue_payment_policies')->nullOnDelete();
            $table->foreignId('operator_assignment_id')->nullable()->constrained('operator_assignments')->nullOnDelete();
            $table->foreignId('membership_card_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_package_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_price', 12, 2);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('remaining_discount_limits')->nullable();
            $table->enum('status', ['pending', 'active', 'queued', 'failed', 'expired', 'cancelled'])->default('pending')->index();
            $table->boolean('is_queued')->default(false);
            $table->string('slug', 100)->nullable();

            $table->string('venue_name_snapshot')->nullable();
            $table->string('operator_name_snapshot')->nullable();

            $table->string('member_no_snapshot')->nullable(); 
            $table->string('member_name_snapshot')->nullable();
            $table->string('member_number_phone_snapshot')->nullable();

            $table->string('package_name_snapshot')->nullable();
            $table->integer('duration_month_snapshot')->nullable();
            $table->string('discount_type_snapshot')->nullable(); 
            $table->decimal('discount_value_snapshot', 10, 2)->nullable();
            $table->integer('discount_limit_snapshot')->nullable();


            $table->boolean('dp_enabled_snapshot')->default(false);
            $table->string('dp_type_snapshot')->nullable();
            $table->decimal('dp_value_snapshot', 12, 2)->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_orders');
    }
};
