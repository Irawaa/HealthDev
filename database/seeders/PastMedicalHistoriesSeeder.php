<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PastMedicalHistoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('past_medical_histories')->insert([
            ['condition_name' => 'Allergy'],
            ['condition_name' => 'Bleeding disorder'],
            ['condition_name' => 'Bronchial asthma'],
            ['condition_name' => 'Cardiovascular Disease'],
            ['condition_name' => 'Hypertension'],
            ['condition_name' => 'Pulmonary Tuberculosis (PTB)'],
            ['condition_name' => 'Skin disorder'],
            ['condition_name' => 'Surgery'],
            ['condition_name' => 'Urinary Tract Infection (UTI)'],
            ['condition_name' => 'Loss of consciousness'],
            ['condition_name' => 'Others'],
        ]);
    }
}
