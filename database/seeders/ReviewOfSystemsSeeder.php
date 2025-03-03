<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewOfSystemsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('review_of_systems')->insert([
            ['symptom' => 'Abdominal pain (pagsakit ng tiyan)'],
            ['symptom' => 'Blurring of vision (panlalabo ng mata)'],
            ['symptom' => 'Chest pain (pagsakit ng dibdib)'],
            ['symptom' => 'Cough and colds (ubo at sipon)'],
            ['symptom' => 'Dysuria (masakit na pag-ihi)'],
            ['symptom' => 'Easy bruisability (mabilis magka pasa)'],
            ['symptom' => 'Easy fatigability (mabilis mapagod)'],
            ['symptom' => 'Fever (lagnat)'],
            ['symptom' => 'LBM (pagtatae)'],
            ['symptom' => 'LOC/ Seizure (nawalan ng malay/konbulsiyon)'],
            ['symptom' => 'Recurrent Headache (pabalik-balik na sakit ng ulo)'],
            ['symptom' => 'Vomiting (pagsusuka)'],
            ['symptom' => 'Others'],
        ]);
    }
}
