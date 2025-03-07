<?php

namespace Database\Seeders;

use App\Models\ClinicStaff;
use App\Models\FamilyHistory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ClinicStaffSeeder::class,
            CollegeSeeder::class,
            ProgramSeeder::class,
            DepartmentSeeder::class,
            PatientsSeeder::class,
            ReviewOfSystemsSeeder::class,
            DeformitiesSeeder::class,
            PastMedicalHistoriesSeeder::class,
            PhysicalExaminationSeeder::class,
            FamilyHistorySeeder::class,
        ]);
    }
}
