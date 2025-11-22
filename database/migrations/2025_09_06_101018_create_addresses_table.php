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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic relation
            $table->unsignedBigInteger('addressable_id');
            $table->string('addressable_type');

            // Alamat lengkap
            $table->text('address')->nullable(); // Jalan, RT/RW, nomor rumah, dsb

            // Foreign key ke Laravolt/Indonesia (gunakan code, bukan id)
            $table->char('province_code', 2)->nullable();
            $table->char('city_code', 4)->nullable();
            $table->char('district_code', 7)->nullable();
            $table->char('village_code', 10)->nullable();

            // Kode pos
            $table->string('postal_code')->nullable();

            // Koordinat geolocation
            $table->decimal('latitude', 10, 7)->nullable();  // Latitude
            $table->decimal('longitude', 10, 7)->nullable(); // Longitude

            // Timestamps
            $table->timestamps();

            // Index untuk polymorphic + foreign keys
            $table->index(['addressable_id', 'addressable_type']);
            $table->index('province_code');
            $table->index('city_code');
            $table->index('district_code');
            $table->index('village_code');
            $table->index(['latitude', 'longitude']); // Berguna untuk pencarian radius

            // Foreign key ke tabel laravolt
            $table->foreign('province_code')->references('code')->on(config('laravolt.indonesia.table_prefix').'provinces')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('city_code')->references('code')->on(config('laravolt.indonesia.table_prefix').'cities')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('district_code')->references('code')->on(config('laravolt.indonesia.table_prefix').'districts')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('village_code')->references('code')->on(config('laravolt.indonesia.table_prefix').'villages')->onUpdate('cascade')->onDelete('restrict');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
