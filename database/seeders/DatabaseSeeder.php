<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            CollegeSeeder::class,
            DepartmentSeeder::class,
            PatientsSeeder::class,
            ProgramSeeder::class,
        ]);
    }
}
