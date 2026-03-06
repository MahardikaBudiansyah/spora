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
        Schema::create('merchant_payout_method_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payout_method_id')->nullable()->constrained('merchant_payout_methods')->nullOnDelete();

            $table->enum('type', ['bank', 'ewallet'])->default('bank');
            $table->string('provider_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->boolean('is_primary')->default(false);

            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchant_payout_method_submissions');
    }
};
