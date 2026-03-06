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
        Schema::create('platform_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained()->cascadeOnDelete();

            $table->string('business_name')->nullable();
            $table->string('business_email')->nullable();
            $table->string('business_phone_number')->nullable();
            $table->enum('business_type', ['individual', 'entity'])->nullable();
            $table->string('nib', 13)->nullable();
            $table->string('logo_path')->nullable();

            $table->string('midtrans_sub_account_id')->nullable();
            $table->string('xendit_sub_account_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_profiles');
    }
};
