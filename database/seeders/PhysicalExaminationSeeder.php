<?php

namespace Database\Seeders;

use App\Models\PhysicalExamination;
use Illuminate\Database\Seeder;

class PhysicalExaminationSeeder extends Seeder
{
    public function run(): void
    {
        $examinations = [
            'General Survey',
            'Eyes/Ear/Nose/Throat',
            'Hearing',
            'Vision',
            'Lymph Nodes',
            'Heart',
            'Lungs',
            'Abdomen',
            'Skin',
            'Extremities',
        ];

        foreach ($examinations as $exam) {
            PhysicalExamination::firstOrCreate(['name' => $exam]);
        }
    }
}
