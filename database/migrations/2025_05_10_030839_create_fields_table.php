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
        Schema::create('fields', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->require();
            $table->unsignedBigInteger('field_type_id');
            $table->text('description');
            $table->string('slug', 100)->nullable();
            $table->unsignedBigInteger('venue_id');
            $table->softDeletes();
            $table->timestamps();


            $table->foreign('field_type_id')->references('id')->on('field_types')->onDelete('cascade');
            $table->foreign('venue_id')->references('id')->on('venues')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
