<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgramSeeder extends Seeder
{
    public function run()
    {
        DB::table('programs')->insert([
            ['program_id' => 2, 'description' => 'Bachelor of Science in Information Technology', 'program_code' => 'BSInfoTech', 'section_code' => 'IT', 'college_id' => 10, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 4, 'description' => 'Bachelor of Science in Computer Science', 'program_code' => 'BSCS', 'section_code' => 'CS', 'college_id' => 10, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 6, 'description' => 'Bachelor of Science in Electronics Engineering', 'program_code' => 'BSECE', 'section_code' => 'ECE', 'college_id' => 11, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 7, 'description' => 'Bachelor of Science in Industrial Engineering', 'program_code' => 'BSIE', 'section_code' => 'IE', 'college_id' => 11, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 8, 'description' => 'Bachelor of Elementary Education', 'program_code' => 'BEED', 'section_code' => 'EED', 'college_id' => 13, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 9, 'description' => 'Bachelor of Secondary Education', 'program_code' => 'BSED', 'section_code' => 'SED', 'college_id' => 13, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 11, 'description' => 'Bachelor of Science in Psychology', 'program_code' => 'BSPsy', 'section_code' => 'PSY', 'college_id' => 12, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 12, 'description' => 'Bachelor of Science in Business Administration', 'program_code' => 'BSBA', 'section_code' => 'BA', 'college_id' => 6, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 14, 'description' => 'Bachelor of Science in Nursing', 'program_code' => 'BSN', 'section_code' => 'BSN', 'college_id' => 14, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 15, 'description' => 'Associate in Computer Technology', 'program_code' => 'ACT', 'section_code' => 'ACT', 'college_id' => 15, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 16, 'description' => 'Bachelor of Science in Computer Engineering', 'program_code' => 'BSCpE', 'section_code' => 'CPE', 'college_id' => 11, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 17, 'description' => 'Bachelor of Science in Accountancy', 'program_code' => 'BSA', 'section_code' => 'BSA', 'college_id' => 6, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
            ['program_id' => 18, 'description' => 'Associate in Computer Secretarial', 'program_code' => 'ACS', 'section_code' => 'ACS', 'college_id' => 6, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 19, 'description' => 'Master of Science in Mathematics', 'program_code' => 'MSMAT', 'section_code' => 'MSMAT', 'college_id' => 7, 'p_id' => 0, 'type' => 4, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 20, 'description' => 'Master of Arts in Education', 'program_code' => 'MAED', 'section_code' => 'MAED', 'college_id' => 7, 'p_id' => 0, 'type' => 4, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 21, 'description' => 'Master in Business Administration', 'program_code' => 'MBAS', 'section_code' => 'MBA', 'college_id' => 7, 'p_id' => 0, 'type' => 4, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 22, 'description' => 'Electronics Product Assembly Servicing NCII', 'program_code' => 'EPAS', 'section_code' => 'EPAS', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 23, 'description' => 'Caregiving NCII', 'program_code' => 'CARE', 'section_code' => 'CARE', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 24, 'description' => 'Automotive NC I', 'program_code' => 'AUTO', 'section_code' => 'AUTO', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 25, 'description' => 'Bookkeeping NC III', 'program_code' => 'BOOK', 'section_code' => 'BOOK', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 26, 'description' => 'Cookery NC II', 'program_code' => 'COOK', 'section_code' => 'COOK', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 27, 'description' => 'Technical Vocational Livelihood', 'program_code' => 'TVL', 'section_code' => 'TVL', 'college_id' => 9, 'p_id' => 0, 'type' => 2, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 28, 'description' => 'Science, Technology, Engineering, and Mathematics', 'program_code' => 'STEM', 'section_code' => 'STEM', 'college_id' => 9, 'p_id' => 0, 'type' => 2, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 29, 'description' => 'Accountancy, Business and Management', 'program_code' => 'ABM', 'section_code' => 'ABM', 'college_id' => 9, 'p_id' => 0, 'type' => 2, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 30, 'description' => 'General Academic Strand', 'program_code' => 'GAS', 'section_code' => 'GAS', 'college_id' => 9, 'p_id' => 0, 'type' => 2, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 31, 'description' => 'Bachelor of Science in Information Technology', 'program_code' => 'BSIT', 'section_code' => 'IT', 'college_id' => 10, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 32, 'description' => 'Humanities and Social Sciences', 'program_code' => 'HUMSS', 'section_code' => 'HUMSS', 'college_id' => 9, 'p_id' => 0, 'type' => 2, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 33, 'description' => 'Driving NC II', 'program_code' => 'DRIVE', 'section_code' => 'DRIVE', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 34, 'description' => 'Computer Programming NC IV', 'program_code' => 'COMP', 'section_code' => 'COMP', 'college_id' => 8, 'p_id' => 0, 'type' => 1, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 35, 'description' => 'Temp', 'program_code' => '', 'section_code' => 'TEMP', 'college_id' => 10, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 36, 'description' => 'Bachelor of Science in Management Accounting', 'program_code' => 'BSMA', 'section_code' => 'MA', 'college_id' => 6, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 37, 'description' => 'Bachelor of Public Administration', 'program_code' => 'BPA', 'section_code' => 'PA', 'college_id' => 6, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 38, 'description' => 'Master of Arts in Psychology', 'program_code' => 'MAPsy', 'section_code' => 'MAPsy', 'college_id' => 7, 'p_id' => 0, 'type' => 4, 'is_active' => 1, 'is_board' => 0],
            ['program_id' => 39, 'description' => 'Bachelor of Science in Information Systems', 'program_code' => 'BSIS', 'section_code' => 'IS', 'college_id' => 10, 'p_id' => 0, 'type' => 0, 'is_active' => 0, 'is_board' => 0],
            ['program_id' => 40, 'description' => 'Teacher Certification Program', 'program_code' => 'TCP', 'section_code' => 'TCP', 'college_id' => 13, 'p_id' => 0, 'type' => 0, 'is_active' => 1, 'is_board' => 1],
        ]);
    }
}
