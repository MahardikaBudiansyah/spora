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
        Schema::create('membership_cards', function (Blueprint $table) {
            $table->id();
            $table->string('member_no')->unique();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            
            $table->string('name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();

            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->string('slug', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['phone_number', 'venue_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_cards');
    }
};
