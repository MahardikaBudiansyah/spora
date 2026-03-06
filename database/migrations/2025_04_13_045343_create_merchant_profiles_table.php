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
        Schema::create('merchant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained()->cascadeOnDelete();

            $table->string('business_name')->nullable();
            $table->string('business_email')->nullable();
            $table->string('business_phone_number')->nullable();
            $table->enum('business_type', ['individual', 'entity'])->nullable();
            $table->string('nib', 13)->nullable();

            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchant_profiles');
    }
};
