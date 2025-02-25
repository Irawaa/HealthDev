<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        DB::table('departments')->insert([
            ['dept_id' => 1, 'name' => 'Office of the University President', 'acronym' => 'OUP', 'division' => 'OUP', 'level' => 0, 'is_college' => 0, 'dept_head' => 961, 'is_active' => 1],
            ['dept_id' => 2, 'name' => 'Office of the Executive Vice President', 'acronym' => 'OEVP', 'division' => 'EVP', 'level' => 1, 'is_college' => 0, 'dept_head' => 48, 'is_active' => 1],
            ['dept_id' => 3, 'name' => 'Office of the Vice President for Academic Affairs', 'acronym' => 'OVPAA', 'division' => 'AA', 'level' => 1, 'is_college' => 0, 'dept_head' => 48, 'is_active' => 1],
            ['dept_id' => 4, 'name' => 'Office of the Vice President for Administration & Finance', 'acronym' => 'OVPAF', 'division' => 'AF', 'level' => 1, 'is_college' => 0, 'dept_head' => 956, 'is_active' => 1],
            ['dept_id' => 5, 'name' => 'Office of the Vice President for Planning, Research & Extension', 'acronym' => 'OVPPRE', 'division' => 'PRE', 'level' => 1, 'is_college' => 0, 'dept_head' => 822, 'is_active' => 1],
            ['dept_id' => 6, 'name' => 'Office of the Vice President for Student Development & Auxiliary Services', 'acronym' => 'OVPSDAS', 'division' => 'SDAS', 'level' => 1, 'is_college' => 0, 'dept_head' => 384, 'is_active' => 1],
            ['dept_id' => 7, 'name' => 'Office of the University Secretary', 'acronym' => 'OUS', 'division' => 'OUP', 'level' => 2, 'is_college' => 0, 'dept_head' => 959, 'is_active' => 1],
            ['dept_id' => 8, 'name' => 'Management Information Systems Department', 'acronym' => 'MISD', 'division' => 'EVP', 'level' => 3, 'is_college' => 0, 'dept_head' => 955, 'is_active' => 1],
            ['dept_id' => 9, 'name' => 'College of Business, Accountancy & Administration', 'acronym' => 'CBAA', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 1005, 'is_active' => 1],
            ['dept_id' => 10, 'name' => 'College of Computing Studies', 'acronym' => 'CCS', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 1010, 'is_active' => 1],
            ['dept_id' => 12, 'name' => 'College of Engineering', 'acronym' => 'COE', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 1049, 'is_active' => 1],
            ['dept_id' => 13, 'name' => 'College of Health & Allied Sciences', 'acronym' => 'CHAS', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 289, 'is_active' => 1],
            ['dept_id' => 14, 'name' => 'Graduate School', 'acronym' => 'GS', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 799, 'is_active' => 1],
            ['dept_id' => 15, 'name' => 'Senior High School', 'acronym' => 'SHS', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 0, 'is_active' => 0],
            ['dept_id' => 16, 'name' => 'Technical & Vocational Education Department', 'acronym' => 'TVED', 'division' => 'AA', 'level' => 3, 'is_college' => 0, 'dept_head' => 0, 'is_active' => 0],
            ['dept_id' => 17, 'name' => 'Continuing Professional Education Department', 'acronym' => 'CPED', 'division' => 'AA', 'level' => 3, 'is_college' => 0, 'dept_head' => 0, 'is_active' => 0],
            ['dept_id' => 18, 'name' => 'University Library', 'acronym' => 'ULIB', 'division' => 'AA', 'level' => 3, 'is_college' => 0, 'dept_head' => 798, 'is_active' => 1],
            ['dept_id' => 19, 'name' => 'Office of the University Registrar', 'acronym' => 'OUR', 'division' => 'AA', 'level' => 3, 'is_college' => 0, 'dept_head' => 799, 'is_active' => 1],
            ['dept_id' => 38, 'name' => 'College of Arts and Sciences', 'acronym' => 'CAS', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 60, 'is_active' => 1],
            ['dept_id' => 39, 'name' => 'College of Education', 'acronym' => 'COED', 'division' => 'AA', 'level' => 3, 'is_college' => 1, 'dept_head' => 522, 'is_active' => 1],
            ['dept_id' => 40, 'name' => 'Office of the Campus Director', 'acronym' => 'OCD', 'division' => 'EVP', 'level' => 2, 'is_college' => 0, 'dept_head' => 0, 'is_active' => 0],
        ]);
    }
}

