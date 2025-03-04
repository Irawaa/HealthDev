<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeformitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('deformities')->insert([
            ['symptom' => 'Cleft Lip (Bingot)'],
            ['symptom' => 'Exotropia (walleyed / banlag)'],
            ['symptom' => 'Poliomyelitis'],
            ['symptom' => 'Scoliosis'],
            ['symptom' => 'Strabismus (cross-eyed / duling)'],
            ['symptom' => 'None'],
        ]);
    }
}
