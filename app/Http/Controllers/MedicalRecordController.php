<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\MedicalRecordVitalSign;
use App\Models\ReviewOfSystem;
use App\Models\PastMedicalHistory;
use App\Models\Deformity;
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
                'height' => 'required|numeric|min:0.5|max:3.0',

                // ✅ Past Medical Histories Validation
                'past_medical_histories' => 'array',
                'past_medical_histories.*' => 'string',
                'other_condition' => 'nullable|string',
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

            Log::info('Medical record stored successfully', ['medical_record_id' => $medicalRecord->id]);
            return redirect()->route('patients.index')->with('success', 'Medical record created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing medical record', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->withErrors('Failed to create medical record. Please try again.');
        }
    }
}
