<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clinic_staffs', function (Blueprint $table) {
            $table->smallIncrements('staff_id');
            $table->string('lname', 100);
            $table->string('fname', 100);
            $table->string('mname', 100)->nullable();
            $table->string('ext', 10)->nullable();
            $table->enum('role', ['Clinic Nurse', 'University Physician', 'Clinic Dentist', 'Clinic Assistant', 'Clinic Physician']);
            $table->string('license_no', 50);
            $table->string('ptr_no', 50);
            $table->string('email', 200)->unique();
            $table->string('contact_no', 50)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id');
            $table->string('username', 50)->unique()->nullable();
            $table->string('email', 200)->unique();
            $table->text('password');
            $table->text('passkey')->nullable();
            $table->unsignedSmallInteger('staff_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->tinyInteger('flag')->nullable();
            $table->enum('role', ['admin', 'user'])->default('user'); // Role column
            $table->rememberToken();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            $table->foreign('staff_id')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('clinic_staffs');
    }
};
