<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PreParticipatoryQuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            'May pagkakataon ba na hindi ka pinahintulutan ng isang doctor na makilahok sa anumang isport/aktibidad sa anumang kadahilanan?',
            'Napayuhan ka na ba ng doctor na mag pagawa ng ECG o 2D echo?',
            'Kasalukuyan ka bang umiinom ng anumang gamot?',
            'Naranasan mo na ba ang sumakit o parang may nakadagan sa dibdib o hirap sa paghinga habang o pagkatapos ng ehersisyo o gumawa ng mabigat na gawain pisikal?',
            'Naranasan mo na ba na magkaroon ng sprain, nabalian ng buto o dislocated joints?',
            'Naranasan mo na bang mag kumbulsyon?',
        ];

        foreach ($questions as $question) {
            DB::table('pre_participatory_questions')->insert([
                'question' => $question,
            ]);
        }
    }
}
