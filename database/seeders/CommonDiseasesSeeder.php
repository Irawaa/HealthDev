<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommonDiseasesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('common_diseases')->insert([
            // ✅ Common Symptoms
            ['name' => 'Fever'],
            ['name' => 'Cough'],
            ['name' => 'Sore Throat'],
            ['name' => 'Runny Nose'],
            ['name' => 'Nasal Congestion'],
            ['name' => 'Sneezing'],
            ['name' => 'Headache'],
            ['name' => 'Body Aches'],
            ['name' => 'Fatigue'],
            ['name' => 'Dizziness'],
            ['name' => 'Nausea'],
            ['name' => 'Vomiting'],
            ['name' => 'Diarrhea'],
            ['name' => 'Abdominal Pain'],
            ['name' => 'Shortness of Breath'],
            ['name' => 'Chest Pain (Mild)'],
            ['name' => 'Joint Pain'],
            ['name' => 'Skin Rash'],
            ['name' => 'Itchy Skin'],
            ['name' => 'Swollen Lymph Nodes'],

            // ✅ Minor & Common Illnesses
            ['name' => 'Common Cold'],
            ['name' => 'Influenza (Flu)'],
            ['name' => 'Bronchitis'],
            ['name' => 'Pneumonia (Mild)'],
            ['name' => 'Gastroenteritis (Stomach Flu)'],
            ['name' => 'Migraine'],
            ['name' => 'Sinusitis'],
            ['name' => 'Otitis Media (Ear Infection)'],
            ['name' => 'Allergic Rhinitis (Hay Fever)'],
            ['name' => 'Eczema'],
            ['name' => 'Psoriasis'],
            ['name' => 'Acne'],
            ['name' => 'Conjunctivitis (Pink Eye)'],
            ['name' => 'Tonsillitis'],
            ['name' => 'Gastroesophageal Reflux Disease (GERD)'],
            ['name' => 'Irritable Bowel Syndrome (IBS)'],
            ['name' => 'Anemia (Mild)'],
            ['name' => 'Hepatitis A'],
            ['name' => 'Chickenpox'],
            ['name' => 'Measles'],
            ['name' => 'Mumps'],
            ['name' => 'Rubella'],
            ['name' => 'Dengue Fever'],
            ['name' => 'Tension Headaches'],
            ['name' => 'Athlete’s Foot'],
            ['name' => 'Ringworm'],
            ['name' => 'Urinary Tract Infection (UTI)'],
            ['name' => 'Tendonitis'],
            ['name' => 'Carpal Tunnel Syndrome'],

            // ✅ Major Diseases
            ['name' => 'Hypertension'],
            ['name' => 'Diabetes Mellitus'],
            ['name' => 'Asthma'],
            ['name' => 'Tuberculosis'],
            ['name' => 'Hyperthyroidism'],
            ['name' => 'Hypothyroidism'],
            ['name' => 'Chronic Kidney Disease'],
            ['name' => 'Dyslipidemia'],
            ['name' => 'Peptic Ulcer Disease'],
            ['name' => 'Coronary Artery Disease'],
            ['name' => 'Osteoarthritis'],
            ['name' => 'Rheumatoid Arthritis'],
            ['name' => 'Gout'],
            ['name' => 'Sciatica'],
            ['name' => 'Parkinson’s Disease'],
            ['name' => 'Alzheimer’s Disease'],
            ['name' => 'Depression'],
            ['name' => 'Anxiety Disorders'],
            ['name' => 'Bipolar Disorder'],
            ['name' => 'Schizophrenia'],
        ]);
    }
}
