<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;
use App\Models\FamilyHistory;

class FamilyHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conditions = [
            'Bronchial Asthma',
            'Cancer',
            'Diabetes Mellitus',
            'Kidney Disease',
            'Heart Disease',
            'Hypertension',
            'Mental Illness'
        ];

        foreach ($conditions as $condition) {
            FamilyHistory::create([
                'condition' => $condition
            ]);
        }
    }
}
