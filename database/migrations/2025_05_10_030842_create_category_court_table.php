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
        Schema::create('category_court', function (Blueprint $table) {
            $table->id();
            $table->foreignId('court_id')->constrained('courts')->cascadeOnDelete();
            $table->foreignId('court_category_id')->constrained('court_categories')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->integer('order')->default(0);
            $table->string('notes')->nullable();

            $table->timestamps();
            $table->unique(['court_id', 'court_category_id'], 'court_category_unique');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_court');
    }
};
