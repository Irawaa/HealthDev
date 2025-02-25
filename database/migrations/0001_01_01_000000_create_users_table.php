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

        DB::table('clinic_staffs')->insert([
            ['lname' => 'Garcia', 'fname' => 'Juan', 'mname' => 'D', 'ext' => NULL, 'role' => 'Clinic Nurse', 'license_no' => 'LN12345', 'ptr_no' => 'PTR54321', 'email' => 'juan.garcia@example.com', 'contact_no' => '09123456789'],
            ['lname' => 'Reyes', 'fname' => 'Maria', 'mname' => 'E', 'ext' => NULL, 'role' => 'Clinic Physician', 'license_no' => 'LN67890', 'ptr_no' => 'PTR09876', 'email' => 'maria.reyes@example.com', 'contact_no' => '09234567890'],
            ['lname' => 'Santos', 'fname' => 'Carlos', 'mname' => NULL, 'ext' => 'Jr.', 'role' => 'Clinic Dentist', 'license_no' => 'LN11223', 'ptr_no' => 'PTR33211', 'email' => 'carlos.santos@example.com', 'contact_no' => '09345678901'],
            ['lname' => 'Cruz', 'fname' => 'Ana', 'mname' => 'M', 'ext' => NULL, 'role' => 'Clinic Nurse', 'license_no' => 'LN44556', 'ptr_no' => 'PTR66544', 'email' => 'ana.cruz@example.com', 'contact_no' => '09456789012'],
            ['lname' => 'Delos Reyes', 'fname' => 'Mark', 'mname' => NULL, 'ext' => 'Sr.', 'role' => 'Clinic Physician', 'license_no' => 'LN77889', 'ptr_no' => 'PTR99877', 'email' => 'mark.reyes@example.com', 'contact_no' => '09567890123'],
            ['lname' => 'Lopez', 'fname' => 'Sofia', 'mname' => 'T', 'ext' => NULL, 'role' => 'Clinic Dentist', 'license_no' => 'LN99100', 'ptr_no' => 'PTR00199', 'email' => 'sofia.lopez@example.com', 'contact_no' => '09678901234'],
            ['lname' => 'Fernandez', 'fname' => 'Luis', 'mname' => 'P', 'ext' => NULL, 'role' => 'Clinic Nurse', 'license_no' => 'LN22334', 'ptr_no' => 'PTR44322', 'email' => 'luis.fernandez@example.com', 'contact_no' => '09789012345'],
            ['lname' => 'Torres', 'fname' => 'Jessica', 'mname' => NULL, 'ext' => NULL, 'role' => 'Clinic Physician', 'license_no' => 'LN55667', 'ptr_no' => 'PTR77655', 'email' => 'jessica.torres@example.com', 'contact_no' => '09890123456'],
            ['lname' => 'Ramos', 'fname' => 'Miguel', 'mname' => 'L', 'ext' => NULL, 'role' => 'Clinic Dentist', 'license_no' => 'LN88990', 'ptr_no' => 'PTR00988', 'email' => 'miguel.ramos@example.com', 'contact_no' => '09901234567'],
            ['lname' => 'Gonzales', 'fname' => 'Elena', 'mname' => 'K', 'ext' => NULL, 'role' => 'Clinic Nurse', 'license_no' => 'LN33445', 'ptr_no' => 'PTR55433', 'email' => 'elena.gonzales@example.com', 'contact_no' => '09012345678']
        ]);

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

        // Fetch the first clinic staff (assuming staff_id = 1)
        $clinicStaff = DB::table('clinic_staffs')->where('staff_id', 1)->first();

        if ($clinicStaff) {
            // Check if an admin user already exists
            $existingAdmin = DB::table('users')->where('role', 'admin')->exists();

            if (!$existingAdmin) {
                // Insert only if no admin exists
                DB::table('users')->insert([
                    'username' => 'admin',
                    'email' => $clinicStaff->email, // Use email from clinic_staffs
                    'password' => Hash::make('12345678'), // Hash password
                    'staff_id' => $clinicStaff->staff_id,
                    'is_active' => 1,
                    'flag' => null,
                    'role' => 'admin', // Set role as admin
                    'remember_token' => Str::random(10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                echo "Admin user created successfully!";
            } else {
                echo "Admin user already exists!";
            }
        } else {
            echo "Clinic staff with staff_id 1 not found!";
        }

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
