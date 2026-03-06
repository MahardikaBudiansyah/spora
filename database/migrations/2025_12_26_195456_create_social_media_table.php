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
        Schema::create('social_media', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('socialable_id');
            $table->string('socialable_type');

            $table->string('platform');
            $table->string('username');
            $table->string('url');

            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['socialable_id', 'socialable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_media');
    }
};
