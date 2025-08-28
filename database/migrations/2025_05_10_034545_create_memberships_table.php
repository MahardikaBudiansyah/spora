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
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('venue_id');
        $table->unsignedBigInteger('membership_package_id');
        $table->unsignedBigInteger('membership_duration_id');
        $table->decimal('total_price', 10, 2);
        $table->date('start_date');
        $table->date('end_date');
        $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
        $table->string('slug', 100)->nullable();
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('venue_id')->references('id')->on('venues')->onDelete('cascade');
        $table->foreign('membership_package_id')->references('id')->on('membership_packages')->onDelete('cascade');
        $table->foreign('membership_duration_id')->references('id')->on('membership_durations')->onDelete('cascade');

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
