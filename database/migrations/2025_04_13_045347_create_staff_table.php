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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('merchant_staff_role_id')->constrained('merchant_staff_roles')->cascadeOnDelete();

            $table->string('name');
            $table->string('username');
            $table->string('phone_number');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('status', ['active', 'inactive', 'resigned'])->default('active');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->rememberToken();
            $table->softDeletes(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
