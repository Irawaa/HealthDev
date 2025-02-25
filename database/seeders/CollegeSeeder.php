<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollegeSeeder extends Seeder
{
    public function run()
    {
        DB::table('colleges')->insert([
            ['college_id' => 2, 'description' => 'College of Information Technology and Engineering', 'college_code' => 'CITE', 'dean_id' => null, 'secretary_id' => null, 'is_active' => 0],
            ['college_id' => 3, 'description' => 'College of Education, Art and Sciences', 'college_code' => 'CEAS', 'dean_id' => null, 'secretary_id' => null, 'is_active' => 0],
            ['college_id' => 5, 'description' => 'College of Nursing', 'college_code' => 'CON', 'dean_id' => null, 'secretary_id' => null, 'is_active' => 0],
            ['college_id' => 6, 'description' => 'College of Business, Administration and Accountancy', 'college_code' => 'CBAA', 'dean_id' => 1005, 'secretary_id' => 656, 'is_active' => 1],
            ['college_id' => 7, 'description' => 'Graduate School', 'college_code' => 'GS', 'dean_id' => 799, 'secretary_id' => 1, 'is_active' => 1],
            ['college_id' => 8, 'description' => 'School of Technical Vocational Education', 'college_code' => 'STeVE', 'dean_id' => null, 'secretary_id' => null, 'is_active' => 0],
            ['college_id' => 9, 'description' => 'Senior High School', 'college_code' => 'SHS', 'dean_id' => 0, 'secretary_id' => null, 'is_active' => 1],
            ['college_id' => 10, 'description' => 'College of Computing Studies', 'college_code' => 'CCS', 'dean_id' => 1010, 'secretary_id' => 1129, 'is_active' => 1],
            ['college_id' => 11, 'description' => 'College of Engineering', 'college_code' => 'COE', 'dean_id' => 1049, 'secretary_id' => 1013, 'is_active' => 1],
            ['college_id' => 12, 'description' => 'College of Arts and Sciences', 'college_code' => 'CAS', 'dean_id' => 60, 'secretary_id' => 1114, 'is_active' => 1],
            ['college_id' => 13, 'description' => 'College of Education', 'college_code' => 'COED', 'dean_id' => 522, 'secretary_id' => 1008, 'is_active' => 1],
            ['college_id' => 14, 'description' => 'College of Health and Allied Sciences', 'college_code' => 'CHAS', 'dean_id' => 289, 'secretary_id' => 821, 'is_active' => 1],
            ['college_id' => 15, 'description' => 'College of Computing and Engineering', 'college_code' => 'CCE', 'dean_id' => null, 'secretary_id' => null, 'is_active' => 0],
        ]);
    }
}
