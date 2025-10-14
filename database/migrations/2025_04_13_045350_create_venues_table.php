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
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('merchant_id');
            $table->string('name', 100)->require();
            $table->text('description')->nullable();
            $table->string('phone_number')->nullable();
            $table->enum('status', ['pending', 'active', 'rejected'])->default('pending');
            $table->boolean('is_active')->default(true);
            $table->string('slug', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('merchant_id')->references('id')->on('merchants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
