<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ClinicStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Clinic Staff Data
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

                echo "Admin user created successfully!\n";
            } else {
                echo "Admin user already exists!\n";
            }
        } else {
            echo "Clinic staff with staff_id 1 not found!\n";
        }
    }
}
