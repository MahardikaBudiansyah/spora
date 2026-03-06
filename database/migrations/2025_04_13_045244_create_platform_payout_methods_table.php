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
        Schema::create('platform_payout_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('platform_profile_id')->constrained('platform_profiles')->cascadeOnDelete();

            $table->enum('type', ['bank', 'ewallet'])->default('bank');
        
            $table->string('provider_name'); 
            $table->string('account_number'); 
            $table->string('account_holder_name'); 

            $table->boolean('is_primary')->default(false);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_payout_methods');
    }
};
