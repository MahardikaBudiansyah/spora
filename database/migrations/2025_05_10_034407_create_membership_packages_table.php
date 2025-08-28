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
        Schema::create('membership_packages', function (Blueprint $table) {
        $table->id();
        $table->string('name');  // Nama paket (Silver, Gold, Platinum)
        $table->decimal('price', 10, 2);  // Harga paket
        $table->text('description')->nullable();  // Deskripsi paket
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_packages');
    }
};
