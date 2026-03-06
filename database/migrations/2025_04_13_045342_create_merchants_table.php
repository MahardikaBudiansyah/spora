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
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('pending_email')->nullable()->index();
            $table->string('password');
            $table->string('phone_number', 20);
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('midtrans_sub_account_id')->nullable();
            $table->string('xendit_sub_account_id')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'banned', 'deactivation_requested'])->default('draft');
            $table->boolean('is_reverification_required')->default(false);
            $table->boolean('is_active')->default(false);
            $table->string('slug', 100)->unique();
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
        Schema::dropIfExists('merchants');
    }
};
