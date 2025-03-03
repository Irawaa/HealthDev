<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\ReviewOfSystem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
                'recorded_by' => 'required|exists:clinic_staffs,staff_id',
                'review_of_systems' => 'array',
                'review_of_systems.*' => 'string',
                'others' => 'nullable|string',
            ]);
            Log::info('Validation passed', ['validated' => $validated]);

            $medicalRecord = MedicalRecord::create($validated);
            Log::info('Medical record created', ['medical_record' => $medicalRecord]);

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

            Log::info('Medical record stored successfully', ['medical_record_id' => $medicalRecord->id]);
            return redirect()->route('patients.index')->with('success', 'Medical record created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing medical record', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->withErrors('Failed to create medical record. Please try again.');
        }
    }
}
