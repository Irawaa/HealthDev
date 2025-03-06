<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\ReviewOfSystem;
use App\Models\Deformity;
use App\Models\MedicalRecordVitalSign;
use App\Models\PastMedicalHistory;
use App\Models\ObGyneHistory;
use App\Models\PersonalSocialHistory;
use App\Models\FamilyHistory;
use App\Models\PhysicalExamination;
use App\Models\MedicalRecordDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Request received', ['request' => $request->all()]);

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_nurse_id' => 'required|exists:clinic_staffs,staff_id',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
                'final_evaluation' => 'nullable|in:Class A,Class B,Pending',
                'plan_recommendation' => 'nullable|string',

                // ✅ Review of Systems Validation
                'review_of_systems' => 'array',
                'review_of_systems.*' => 'string',
                'others' => 'nullable|string',

                // ✅ Deformities Validation
                'deformities' => 'array',
                'deformities.*' => 'string|exists:deformities,symptom',

                // ✅ Vital Signs Validation
                'bp' => 'required|string|max:10',
                'rr' => 'required|integer|min:0',
                'hr' => 'required|integer|min:0',
                'temperature' => 'required|numeric|min:30|max:45',
                'weight' => 'required|numeric|min:1|max:300',
                'height' => 'required|numeric|min:0.5|max:5.0',

                // ✅ Past Medical Histories Validation
                'past_medical_histories' => 'array',
                'past_medical_histories.*' => 'string',
                'other_condition' => 'nullable|string',

                // ✅ OB/Gyne History Validation (Optional)
                'menstruation' => 'nullable|in:Regular,Irregular',
                'duration' => 'nullable|in:1-3 days,4-6 days,7-9 days',
                'dysmenorrhea' => 'nullable|boolean',
                'pregnant_before' => 'nullable|boolean',
                'num_of_pregnancies' => 'nullable|integer|min:0',
                'last_menstrual_period' => 'nullable|date',

                // ✅ Medical Record Details Validation

                // ✅ Chief Complaint
                'chief_complaint' => 'nullable|string',

                // ✅ Present Illness
                'present_illness' => 'nullable|string',

                // ✅ Medication
                'medication' => 'nullable|string',

                // ✅ Hospitalized?
                'hospitalized' => 'nullable|boolean',
                'hospitalized_reason' => 'nullable|string',

                // ✅ Previous Surgery?
                'previous_surgeries' => 'nullable|boolean',
                'surgery_reason' => 'nullable|string',

                // ----- Here ----//
                // ✅ Personal & Social History Validation
                'alcoholic_drinker' => 'nullable|in:Regular,Occasional,No',
                'smoker' => 'nullable|boolean',
                'sticks_per_day' => 'nullable|integer|min:0',
                'years_smoking' => 'nullable|integer|min:0',
                'illicit_drugs' => 'nullable|boolean',
                'eye_glasses' => 'nullable|boolean',
                'contact_lens' => 'nullable|boolean',
                'eye_disorder_no' => 'nullable|boolean',

                // ✅ Family History
                'family_histories' => 'array',
                'family_histories.*' => 'string|exists:family_histories,condition',
                'relationships' => 'array',
                'relationships.*' => 'nullable|string|in:Father,Mother,Sister,Brother',

                // ✅ Physical Examination Validation
                'physical_examinations' => 'array',
                'physical_examinations.*.name' => 'required|string|exists:physical_examinations,name',
                'physical_examinations.*.result' => 'nullable|in:Normal,Abnormal',
                'physical_examinations.*.remarks' => 'nullable|string',

                // ✅ X-Ray Image
                'chest_xray' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Image Validation

                // ✅ Vaccination Status
                'vaccination_status' => 'nullable|string',

                // ✅ Laboratory
                'blood_chemistry' => 'nullable|string',
                'fbs' => 'nullable|numeric',
                'uric_acid' => 'nullable|numeric',
                'triglycerides' => 'nullable|numeric',
                't_cholesterol' => 'nullable|numeric',
                'creatinine' => 'nullable|numeric',
            ]);

            Log::info('Validation passed', ['validated' => $validated]);

            // Get authenticated user
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                return redirect()->back()->withErrors('Unauthorized action.');
            }

            // ✅ Create Medical Record
            $medicalRecord = MedicalRecord::create([
                'patient_id' => $validated['patient_id'],
                'school_nurse_id' => $validated['school_nurse_id'],
                'school_physician_id' => $validated['school_physician_id'],
                'recorded_by' => $recordedBy,
                'final_evaluation' => $validated['final_evaluation'] ?? null,
                'plan_recommendation' => $validated['plan_recommendation'] ?? null,
            ]);

            Log::info('Medical record created', ['medical_record' => $medicalRecord]);

            // ✅ Handling Review of Systems
            if ($request->has('review_of_systems')) {
                $reviewOfSystems = ReviewOfSystem::whereIn('symptom', $validated['review_of_systems'])->get();
                Log::info('Review of systems fetched', ['review_of_systems' => $reviewOfSystems]);

                $syncData = [];

                foreach ($reviewOfSystems as $review) {
                    $syncData[$review->id] = ['custom_symptom' => null];
                }

                if (!empty($validated['others'])) {
                    $customReview = ReviewOfSystem::firstOrCreate(['symptom' => 'Others']);
                    Log::info('Custom review created/fetched', ['customReview' => $customReview]);
                    $syncData[$customReview->id] = ['custom_symptom' => $validated['others']];
                }

                Log::info('Syncing review of systems', ['syncData' => $syncData]);
                $medicalRecord->reviewOfSystems()->sync($syncData);
            }

            // ✅ Handling Deformities
            if (!empty($validated['deformities'])) {
                $deformities = Deformity::whereIn('symptom', $validated['deformities'])->get();
                Log::info('Deformities fetched', ['deformities' => $deformities]);

                $deformitySyncData = [];
                foreach ($deformities as $deformity) {
                    $deformitySyncData[$deformity->id] = [];
                }

                Log::info('Syncing deformities', ['deformitySyncData' => $deformitySyncData]);
                $medicalRecord->deformities()->sync($deformitySyncData);
            }

            // ✅ Store Vital Signs
            $vitalSignsData = [
                'medical_record_id' => $medicalRecord->id,
                'bp' => $validated['bp'],
                'rr' => $validated['rr'],
                'hr' => $validated['hr'],
                'temperature' => $validated['temperature'],
                'weight' => $validated['weight'],
                'height' => $validated['height'],
            ];

            $vitalSigns = MedicalRecordVitalSign::create($vitalSignsData);
            Log::info('Vital signs stored', ['vital_signs' => $vitalSigns]);

            // ✅ Handling Past Medical Histories
            if (!empty($validated['past_medical_histories'])) {
                $pastMedicalHistories = PastMedicalHistory::whereIn('condition_name', $validated['past_medical_histories'])->get();
                $pastHistorySyncData = [];
                foreach ($pastMedicalHistories as $history) {
                    $pastHistorySyncData[$history->id] = ['custom_condition' => null];
                }
                if (!empty($validated['other_condition'])) {
                    $customHistory = PastMedicalHistory::firstOrCreate(['condition_name' => 'Others']);
                    $pastHistorySyncData[$customHistory->id] = ['custom_condition' => $validated['other_condition']];
                }
                $medicalRecord->pastMedicalHistories()->sync($pastHistorySyncData);
            }

            // ✅ Store OB/Gyne History (Optional)
            if ($request->filled(['menstruation', 'duration'])) {
                $obGyneData = [
                    'medical_record_id' => $medicalRecord->id,
                    'menstruation' => $validated['menstruation'],
                    'duration' => $validated['duration'],
                    'dysmenorrhea' => $validated['dysmenorrhea'] ?? null,
                    'pregnant_before' => $validated['pregnant_before'] ?? null,
                    'num_of_pregnancies' => $validated['num_of_pregnancies'] ?? null,
                    'last_menstrual_period' => $validated['last_menstrual_period'] ?? null,
                ];

                $obGyne = ObGyneHistory::create($obGyneData);
                Log::info('OB/Gyne history stored', ['ob_gyne' => $obGyne]);
            }

            // ✅ Store Personal & Social History
            $personalSocialHistoryData = [
                'medical_record_id' => $medicalRecord->id,
                'alcoholic_drinker' => $validated['alcoholic_drinker'] ?? null,
                'smoker' => $validated['smoker'] ?? null,
                'sticks_per_day' => $validated['sticks_per_day'] ?? null,
                'years_smoking' => $validated['years_smoking'] ?? null,
                'illicit_drugs' => $validated['illicit_drugs'] ?? null,
                'eye_glasses' => $validated['eye_glasses'] ?? null,
                'contact_lens' => $validated['contact_lens'] ?? null,
                'eye_disorder_no' => $validated['eye_disorder_no'] ?? null,
            ];

            $personalSocialHistory = PersonalSocialHistory::create($personalSocialHistoryData);
            Log::info('Personal & Social History stored', ['personal_social_history' => $personalSocialHistory]);

            // Handling Family History
            if (!empty($validated['family_histories'])) {
                $familyHistories = FamilyHistory::whereIn('condition', $validated['family_histories'])->get();
                $familyHistorySyncData = [];

                foreach ($familyHistories as $key => $history) {
                    $familyHistorySyncData[$history->id] = [
                        'relationship' => $validated['relationships'][$key] ?? null, // Add the relationship from the 'relationships' array
                    ];
                }

                Log::info('Syncing family histories', ['familyHistorySyncData' => $familyHistorySyncData]);
                $medicalRecord->familyHistories()->sync($familyHistorySyncData);
            }

            // ✅ Sync Physical Examinations
            if ($request->filled('physical_examinations')) {
                $syncData = [];

                foreach ($validated['physical_examinations'] as $exam) {
                    $physicalExam = PhysicalExamination::where('name', $exam['name'])->first();

                    if ($physicalExam) {
                        $syncData[$physicalExam->id] = [
                            'result' => $exam['result'] ?? 'Normal', // Default Normal
                            'remarks' => $exam['remarks'] ?? null,
                        ];
                    }
                }

                Log::info('Syncing Physical Examinations', ['sync_data' => $syncData]);
                $medicalRecord->physicalExaminations()->sync($syncData);
            }

            // ✅ Store Medical Record Details
            $medicalRecordDetailData = [
                'medical_record_id' => $medicalRecord->id,

                // ✅ Chief Complaint
                'chief_complaint' => $validated['chief_complaint'] ?? null,

                // ✅ Present Illness
                'present_illness' => $validated['present_illness'] ?? null,

                // ✅ Medication
                'medication' => $validated['medication'] ?? null,

                // ✅ Hospitalized?
                'hospitalized' => $validated['hospitalized'] ?? false,
                'hospitalized_reason' => $validated['hospitalized_reason'] ?? null,

                // ✅ Previous Surgery?
                'previous_surgeries' => $validated['previous_surgeries'] ?? false,
                'surgery_reason' => $validated['surgery_reason'] ?? null,

                // ✅ Vaccination Status
                'vaccination_status' => $validated['vaccination_status'] ?? null,

                // ✅ Laborartory
                'blood_chemistry' => $validated['blood_chemistry'] ?? null,
                'fbs' => $validated['fbs'] ?? null,
                'uric_acid' => $validated['uric_acid'] ?? null,
                'triglycerides' => $validated['triglycerides'] ?? null,
                't_cholesterol' => $validated['t_cholesterol'] ?? null,
                'creatinine' => $validated['creatinine'] ?? null,
            ];

            // Store Chest X-ray as Binary Blob
            if ($request->hasFile('chest_xray')) {
                $medicalRecordDetailData['chest_xray'] = $request->file('chest_xray')->getContent();
            }

            $medicalRecordDetail = MedicalRecordDetail::create($medicalRecordDetailData);
            Log::info('Medical Record Detail stored', ['medical_record_detail' => $medicalRecordDetail]);


            Log::info('Medical record stored successfully', ['medical_record_id' => $medicalRecord->id]);
            return redirect()->route('patients.index')->with('success', 'Medical record created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing medical record', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->withErrors('Failed to create medical record. Please try again.');
        }
    }
}
