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
        
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();
            $table->foreignId('venue_payment_policy_id')->nullable()->constrained('venue_payment_policies')->nullOnDelete();
            $table->foreignId('operator_assignment_id')->nullable()->constrained('operator_assignments')->nullOnDelete();
            
            $table->decimal('total_original_price', 12, 2)->nullable();
            $table->decimal('total_discount', 12, 2)->nullable();
            $table->decimal('total_price', 12, 2)->nullable(); 
            
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'failed', 'expired', 'completed'])->default('pending');
            
            $table->string('slug', 100)->nullable();
            

            $table->string('venue_name_snapshot')->nullable();
            $table->string('operator_name_snapshot')->nullable(); 

            $table->string('member_no_snapshot')->nullable(); 
            $table->string('customer_name_snapshot');     
            $table->string('customer_phone_number_snapshot'); 
            $table->string('customer_email_snapshot')->nullable();

            $table->boolean('dp_enabled_snapshot')->default(false);
            $table->decimal('dp_value_snapshot', 12, 2)->nullable();
            $table->string('dp_type_snapshot')->nullable(); 

            $table->integer('full_payment_days_before_snapshot')->nullable();

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
