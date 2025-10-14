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
        Schema::create('membership_users', function (Blueprint $table) {
            $table->id();
            $table->string('member_no')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->string('slug', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['user_id', 'venue_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_users');
    }
};
