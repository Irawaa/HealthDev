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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Request received', ['request' => $request->all()]);

        // Get clinic staff ID from authenticated user (School Nurse ID)
        $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
        if (!$clinicStaffId) {
            Log::warning('Authenticated user is not linked to clinic staff.');
            return back()->withErrors('You are not authorized to submit an medical record.');
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
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

                // ✅ Family History Validation
                'family_histories' => 'array',
                'family_histories.*.condition' => 'required|string|exists:family_histories,condition',
                'family_histories.*.Father' => 'nullable|string',
                'family_histories.*.Mother' => 'nullable|string',
                'family_histories.*.Sister' => 'nullable|array',
                'family_histories.*.Sister.*' => 'nullable|string', // Loop for each Sister
                'family_histories.*.Brother' => 'nullable|array',
                'family_histories.*.Brother.*' => 'nullable|string', // Loop for each Brother
                'family_histories.*.remarks' => 'nullable|string',


                // ✅ Physical Examination Validation
                'physical_examinations' => 'array',
                'physical_examinations.*.name' => 'required|string|exists:physical_examinations,name',
                'physical_examinations.*.result' => 'nullable|in:Normal,Abnormal',
                'physical_examinations.*.remarks' => 'nullable|string',

                // ✅ X-Ray Image
                'chest_xray' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Image Validation
                // 'reset_xray' => 'nullable|boolean',

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
                return back()->withErrors('Unauthorized action.');
            }

            // // Check if Patient Already Has a Medical Record
            // $existingRecord = MedicalRecord::where('patient_id', $validated['patient_id'])->first();

            // if ($existingRecord) {
            //     Log::info('Patient already has an existing medical record', [
            //         'patient_id' => $validated['patient_id'],
            //         'existing_record_id' => $existingRecord->id,
            //         'recorded_by' => Auth::id()
            //     ]);

            //     return back()->withErrors('Patient already has an existing medical record.');
            // }

            // ✅ Create Medical Record
            $medicalRecord = MedicalRecord::create([
                'patient_id' => $validated['patient_id'],
                'school_nurse_id' => $clinicStaffId,
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

            // ✅ Handling Family History
            if ($request->filled('family_histories')) {
                $syncData = [];

                foreach ($validated['family_histories'] as $history) {
                    $familyHistory = FamilyHistory::where('condition', $history['condition'])->first();

                    if ($familyHistory) {
                        foreach (['Father', 'Mother'] as $member) {
                            if (!empty($history[$member])) {
                                $syncData[] = [
                                    'family_history_id' => $familyHistory->id,
                                    'family_member' => $member,
                                    'family_history_remarks' => $history[$member],
                                    'overall_remarks' => $history['remarks'] ?? null,
                                ];
                            }
                        }

                        foreach (['Sister', 'Brother'] as $sibling) {
                            if (!empty($history[$sibling])) {
                                foreach ($history[$sibling] as $key => $note) {
                                    $syncData[] = [
                                        'family_history_id' => $familyHistory->id,
                                        'family_member' => $sibling . ' ' . ($key + 1), // 🔥 Sister 1, Sister 2
                                        'family_history_remarks' => $note,
                                        'overall_remarks' => $history['remarks'] ?? null,
                                    ];
                                }
                            }
                        }
                    }
                }

                Log::info('Syncing Family Histories', ['sync_data' => $syncData]);
                $medicalRecord->familyHistories()->sync($syncData);
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
            return redirect()->back()->with('success', 'Medical record created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing medical record', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors('Failed to create medical record. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Update request received', ['medical_record_id' => $id, 'request' => $request->all()]);

        // Find the medical record
        $medicalRecord = MedicalRecord::findOrFail($id);

        try {
            $validated = $request->validate([
                'final_evaluation' => 'nullable|in:Class A,Class B,Pending',
                'plan_recommendation' => 'nullable|string',

                // ✅ Review of Systems
                'review_of_systems' => 'array',
                'review_of_systems.*' => 'string',
                'others' => 'nullable|string',

                // ✅ Deformities
                'deformities' => 'array',
                'deformities.*' => 'string|exists:deformities,symptom',

                // ✅ Vital Signs
                'bp' => 'required|string|max:10',
                'rr' => 'required|integer|min:0',
                'hr' => 'required|integer|min:0',
                'temperature' => 'required|numeric|min:30|max:45',
                'weight' => 'required|numeric|min:1|max:300',
                'height' => 'required|numeric|min:0.5|max:5.0',

                // ✅ Past Medical History
                'past_medical_histories' => 'array',
                'past_medical_histories.*' => 'string',
                'other_condition' => 'nullable|string',

                // ✅ Medical Record Details
                'chief_complaint' => 'nullable|string',
                'present_illness' => 'nullable|string',
                'medication' => 'nullable|string',
                'hospitalized' => 'nullable|boolean',
                'hospitalized_reason' => 'nullable|string',
                'previous_surgeries' => 'nullable|boolean',
                'surgery_reason' => 'nullable|string',
                'vaccination_status' => 'nullable|string',
                'chest_xray' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',

                // ✅ OB/Gyne History Validation (Optional)
                'menstruation' => 'nullable|in:Regular,Irregular',
                'duration' => 'nullable|in:1-3 days,4-6 days,7-9 days',
                'dysmenorrhea' => 'nullable|boolean',
                'pregnant_before' => 'nullable|boolean',
                'num_of_pregnancies' => 'nullable|integer|min:0',
                'last_menstrual_period' => 'nullable|date',

                // ✅ Personal & Social History
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
                'family_histories.*.condition' => 'required|string|exists:family_histories,condition',
                'family_histories.*.Father' => 'nullable|string',
                'family_histories.*.Mother' => 'nullable|string',
                'family_histories.*.Sister' => 'nullable|array',
                'family_histories.*.Sister.*' => 'nullable|string',
                'family_histories.*.Brother' => 'nullable|array',
                'family_histories.*.Brother.*' => 'nullable|string',
                'family_histories.*.remarks' => 'nullable|string',

                // ✅ Physical Examination
                'physical_examinations' => 'array',
                'physical_examinations.*.name' => 'required|string|exists:physical_examinations,name',
                'physical_examinations.*.result' => 'nullable|in:Normal,Abnormal',
                'physical_examinations.*.remarks' => 'nullable|string',

                // ✅ Laboratory
                'blood_chemistry' => 'nullable|string',
                'fbs' => 'nullable|numeric',
                'uric_acid' => 'nullable|numeric',
                'triglycerides' => 'nullable|numeric',
                't_cholesterol' => 'nullable|numeric',
                'creatinine' => 'nullable|numeric',
            ]);

            Log::info('Validation passed', ['validated' => $validated]);

            // ✅ Update Medical Record
            $medicalRecord->update([
                'final_evaluation' => $validated['final_evaluation'] ?? $medicalRecord->final_evaluation,
                'plan_recommendation' => $validated['plan_recommendation'] ?? $medicalRecord->plan_recommendation,
            ]);

            Log::info('Medical record updated', ['medical_record' => $medicalRecord]);

            // ✅ Update Review of Systems
            if ($request->has('review_of_systems')) {
                $reviewOfSystems = ReviewOfSystem::whereIn('symptom', $validated['review_of_systems'])->get();
                $syncData = [];

                foreach ($reviewOfSystems as $review) {
                    $syncData[$review->id] = ['custom_symptom' => null];
                }

                if (!empty($validated['others'])) {
                    $customReview = ReviewOfSystem::firstOrCreate(['symptom' => 'Others']);
                    $syncData[$customReview->id] = ['custom_symptom' => $validated['others']];
                }

                $medicalRecord->reviewOfSystems()->sync($syncData);
            }

            // ✅ Update Deformities
            if (!empty($validated['deformities'])) {
                $deformities = Deformity::whereIn('symptom', $validated['deformities'])->get();
                $syncData = [];
                foreach ($deformities as $deformity) {
                    $syncData[$deformity->id] = [];
                }
                $medicalRecord->deformities()->sync($syncData);
            }

            // ✅ Update Vital Signs
            $medicalRecord->vitalSigns()->update([
                'bp' => $validated['bp'],
                'rr' => $validated['rr'],
                'hr' => $validated['hr'],
                'temperature' => $validated['temperature'],
                'weight' => $validated['weight'],
                'height' => $validated['height'],
            ]);

            // ✅ Update Past Medical History
            if ($request->has('past_medical_histories')) {
                $syncData = [];

                // Ensure all conditions exist in `past_medical_histories` table
                foreach ($validated['past_medical_histories'] as $condition) {
                    $history = PastMedicalHistory::firstOrCreate(['condition_name' => $condition]);
                    $syncData[$history->id] = ['custom_condition' => null];
                }

                // ✅ Handle "Other" Condition
                if (!empty($validated['other_condition'])) {
                    $customCondition = PastMedicalHistory::firstOrCreate(['condition_name' => 'Others']);
                    $syncData[$customCondition->id] = ['custom_condition' => $validated['other_condition']];
                }

                // Sync Past Medical Histories
                $medicalRecord->pastMedicalHistories()->sync($syncData);
            }

            // ✅ Update OB/Gyne History (Optional)
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

                // ✅ Check if record exists
                $obGyne = ObGyneHistory::where('medical_record_id', $medicalRecord->id)->first();

                if ($obGyne) {
                    // ✅ Update existing record
                    $obGyne->update($obGyneData);
                    Log::info('OB/Gyne history updated', ['ob_gyne' => $obGyne]);
                } else {
                    // ✅ Create new record if not found
                    $obGyne = ObGyneHistory::create($obGyneData);
                    Log::info('OB/Gyne history created', ['ob_gyne' => $obGyne]);
                }
            }

            // ✅ Reset Old Physical Examinations Before Syncing New Ones
            if ($request->filled('physical_examinations')) {
                Log::info('Resetting old physical examinations for medical record ID: ' . $medicalRecord->id);

                // ❗ First, detach all existing physical examinations
                $medicalRecord->physicalExaminations()->detach();

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

                Log::info('Syncing updated Physical Examinations', ['sync_data' => $syncData]);

                // ❗ Now, sync with the new data
                $medicalRecord->physicalExaminations()->sync($syncData);
            }

            // ✅ Update Personal & Social History
            $medicalRecord->personalSocialHistory()->update([
                'alcoholic_drinker' => $validated['alcoholic_drinker'] ?? null,
                'smoker' => $validated['smoker'] ?? null,
                'sticks_per_day' => $validated['sticks_per_day'] ?? null,
                'years_smoking' => $validated['years_smoking'] ?? null,
                'illicit_drugs' => $validated['illicit_drugs'] ?? null,
                'eye_glasses' => $validated['eye_glasses'] ?? null,
                'contact_lens' => $validated['contact_lens'] ?? null,
                'eye_disorder_no' => $validated['eye_disorder_no'] ?? null,
            ]);

            // ✅ Update Family History
            if ($request->filled('family_histories')) {
                $syncData = [];

                // ❗ First, detach all existing related family histories
                $medicalRecord->familyHistories()->detach();

                foreach ($validated['family_histories'] as $history) {
                    $familyHistory = FamilyHistory::where('condition', $history['condition'])->first();

                    if ($familyHistory) {
                        foreach (['Father', 'Mother'] as $member) {
                            if (!empty($history[$member])) {
                                $syncData[] = [
                                    'family_history_id' => $familyHistory->id,
                                    'family_member' => $member,
                                    'family_history_remarks' => $history[$member],
                                    'overall_remarks' => $history['remarks'] ?? null,
                                ];
                            }
                        }

                        foreach (['Sister', 'Brother'] as $sibling) {
                            if (!empty($history[$sibling])) {
                                foreach ($history[$sibling] as $key => $note) {
                                    $syncData[] = [
                                        'family_history_id' => $familyHistory->id,
                                        'family_member' => $sibling . ' ' . ($key + 1), // 🔥 Sister 1, Sister 2
                                        'family_history_remarks' => $note,
                                        'overall_remarks' => $history['remarks'] ?? null,
                                    ];
                                }
                            }
                        }
                    }
                }

                Log::info('Updating Family Histories', ['sync_data' => $syncData]);

                // ❗ Now, sync with the new data
                $medicalRecord->familyHistories()->sync($syncData);
            }

            // ✅ Update Medical Record Details
            $medicalRecord->medicalRecordDetail()->update([
                'chief_complaint' => $validated['chief_complaint'] ?? null,
                'present_illness' => $validated['present_illness'] ?? null,
                'medication' => $validated['medication'] ?? null,
                'hospitalized' => $validated['hospitalized'] ?? false,
                'hospitalized_reason' => $validated['hospitalized_reason'] ?? null,
                'previous_surgeries' => $validated['previous_surgeries'] ?? false,
                'surgery_reason' => $validated['surgery_reason'] ?? null,
                'vaccination_status' => $validated['vaccination_status'] ?? null,

                // ✅ Laborartory
                'blood_chemistry' => $validated['blood_chemistry'] ?? null,
                'fbs' => $validated['fbs'] ?? null,
                'uric_acid' => $validated['uric_acid'] ?? null,
                'triglycerides' => $validated['triglycerides'] ?? null,
                't_cholesterol' => $validated['t_cholesterol'] ?? null,
                'creatinine' => $validated['creatinine'] ?? null,
            ]);

            // if ($request->hasFile('chest_xray')) {
            //     $file = $request->file('chest_xray');

            //     if ($file) {
            //         // Retrieve or create MedicalRecordDetail
            //         $medicalRecordDetail = $medicalRecord->medicalRecordDetail ?? new MedicalRecordDetail(['medical_record_id' => $medicalRecord->id]);

            //         // Convert file to base64 before saving
            //         $medicalRecordDetail->chest_xray = base64_encode(file_get_contents($file->getRealPath()));
            //         $medicalRecordDetail->save(); // ✅ Save changes

            //         Log::info('Chest X-ray updated as Base64 string');
            //     }
            // } else {
            //     // If no new file is uploaded, delete the existing chest_xray
            //     if ($medicalRecord->medicalRecordDetail) {
            //         $medicalRecord->medicalRecordDetail->chest_xray = null;
            //         $medicalRecord->medicalRecordDetail->save();
            //         Log::info('Chest X-ray deleted');
            //     }
            // }

            if ($request->hasFile('chest_xray')) {
                Log::info('Setting chest_xray to null for MedicalRecordDetail ID:', ['id' => $medicalRecord->medicalRecordDetail->id]);

                // Step 1: Delete the old chest_xray
                $medicalRecord->medicalRecordDetail->chest_xray = null;
                $medicalRecord->medicalRecordDetail->save();

                Log::info('After deleting:', ['chest_xray' => $medicalRecord->medicalRecordDetail->chest_xray]);

                // Step 2: Refresh the model to ensure we have the latest state
                $medicalRecord->medicalRecordDetail->refresh();

                // Step 3: Store the new file content
                $file = $request->file('chest_xray');
                $medicalRecord->medicalRecordDetail->chest_xray = $file->getContent(); // Use getContent() to store raw file data
                $medicalRecord->medicalRecordDetail->save();

                Log::info('After uploading new file:', ['chest_xray' => $medicalRecord->medicalRecordDetail->chest_xray]);
            }

            Log::info('Received data', ['data' => $request->all()]);

            Log::info('Medical record updated successfully', ['medical_record_id' => $medicalRecord->id]);
            return redirect()->back()->with('success', 'Medical record updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating medical record', ['message' => $e->getMessage()]);
            return back()->withErrors('Failed to update medical record. Please try again.');
        }
    }

    public function destroy($id)
    {
        try {
            // Fetch the medical record
            $medicalRecord = MedicalRecord::findOrFail($id);

            // ✅ Log the deletion process
            Log::info("Deleting medical record ID: {$medicalRecord->id}");

            // ✅ Detach many-to-many relationships
            $medicalRecord->reviewOfSystems()->detach();
            $medicalRecord->deformities()->detach();
            $medicalRecord->familyHistories()->detach();
            $medicalRecord->physicalExaminations()->detach();

            // ✅ Delete related one-to-many models (Fix: `delete()`, not `detach()`)
            MedicalRecordVitalSign::where('medical_record_id', $medicalRecord->id)->delete();
            ObGyneHistory::where('medical_record_id', $medicalRecord->id)->delete();
            PersonalSocialHistory::where('medical_record_id', $medicalRecord->id)->delete();
            MedicalRecordDetail::where('medical_record_id', $medicalRecord->id)->delete();

            // ✅ Delete the main medical record
            $medicalRecord->delete();

            Log::info("Medical record ID: {$medicalRecord->id} deleted successfully.");
            return redirect()->back()->with('success', 'Medical record deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Failed to delete medical record ID: $id", ['error' => $e->getMessage()]);
            return back()->withErrors('Failed to delete medical record.');
        }
    }

    public function showXrayImage($id)
    {
        // Find the medical record detail
        $medicalRecordDetail = MedicalRecordDetail::findOrFail($id);

        // Ensure X-ray exists
        if (!$medicalRecordDetail->chest_xray) {
            return response()->json(['error' => 'No X-ray image found'], 404);
        }

        // Decode Base64 image and return with correct MIME type
        return response(base64_decode($medicalRecordDetail->chest_xray))
            ->header('Content-Type', 'image/jpeg'); // Adjust MIME type if needed
    }

    public function updateChestXray(Request $request, $id)
    {
        $medicalRecordDetail = MedicalRecordDetail::findOrFail($id);

        if ($request->hasFile('chest_xray') && $request->file('chest_xray')->isValid()) {
            $request->validate([
                'chest_xray' => 'image|mimes:jpeg,png,jpg|max:2048',
            ]);

            Log::info('Updating X-ray image for medical record detail ID: ' . $medicalRecordDetail->id);

            // Delete the old X-ray
            $medicalRecordDetail->update(['chest_xray' => null]);

            // Store the new image as Base64
            $medicalRecordDetail->update([
                'chest_xray' => base64_encode(file_get_contents($request->file('chest_xray')->getRealPath())),
            ]);

            Log::info('New X-ray image stored for medical record detail ID: ' . $medicalRecordDetail->id);

            return redirect()->back()->with('success', 'Chest X-ray updated successfully.');
        } elseif ($request->filled('chest_xray') && $request->chest_xray === null) {
            $medicalRecordDetail->update(['chest_xray' => null]);
            Log::info('X-ray image removed for medical record detail ID: ' . $medicalRecordDetail->id);

            return redirect()->back()->with('success', 'Chest X-ray removed successfully.');
        }

        return redirect()->back()->with('error', 'No valid X-ray image provided.');
    }
}
