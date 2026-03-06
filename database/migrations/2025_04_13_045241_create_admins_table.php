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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar_path')->nullable();

            $table->enum('role', ['superadmin', 'admin'])->default('admin');

            $table->enum('status', ['active', 'inactive', 'resigned', 'banned', 'deactivation_requested'])->default('active');
            $table->boolean('is_active')->default(true);
            $table->string('slug', 100)->unique();

            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
