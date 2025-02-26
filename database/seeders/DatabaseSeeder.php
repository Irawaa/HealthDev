<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            CollegeSeeder::class,
            ProgramSeeder::class,
            DepartmentSeeder::class,
            PatientsSeeder::class,
        ]);
    }
}
