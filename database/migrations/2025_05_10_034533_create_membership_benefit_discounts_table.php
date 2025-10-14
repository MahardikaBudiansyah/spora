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
        Schema::create('membership_benefit_discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membership_package_id')->constrained('membership_packages')->cascadeOnDelete();
            $table->string('name')->default('Potongan Harga'); // kalau mau konsisten namanya
            $table->enum('discount_type', ['percentage', 'fixed']); 
            $table->decimal('discount_value', 10, 2); 
            $table->integer('discount_limit')->nullable(); // berapa kali bisa dipakai
            $table->text('description')->nullable(); // penjelasan tambahan
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_benefit_discounts');
    }
};
