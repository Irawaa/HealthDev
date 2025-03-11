<?php

namespace App\Http\Controllers;

use App\Models\FDARForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FDARFormController extends Controller
{
    public function store(Request $request)
    {
        Log::info('FDAR form submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized FDAR form submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_nurse_id' => 'nullable|exists:clinic_staffs,staff_id',
                'data' => 'required|string',
                'action' => 'required|string',
                'response' => 'required|string',
                'weight' => 'nullable|numeric',
                'height' => 'nullable|numeric',
                'blood_pressure' => 'nullable|string',
                'cardiac_rate' => 'nullable|numeric',
                'respiratory_rate' => 'nullable|numeric',
                'temperature' => 'nullable|numeric',
                'oxygen_saturation' => 'nullable|numeric',
                'last_menstrual_period' => 'nullable|date',
                'common_disease_ids' => 'nullable|array',
                'common_disease_ids.*' => 'exists:common_diseases,id',
            ]);

            Log::info('FDAR form validation passed', ['validated_data' => $validated]);

            // Create FDAR form record
            $fdarForm = FDARForm::create(array_merge($validated, [
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId, // Assign clinic staff ID
            ]));

            Log::info('FDAR form created', [
                'fdar_form_id' => $fdarForm->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            // Attach Common Diseases if provided
            if (!empty($validated['common_disease_ids'])) {
                $fdarForm->commonDiseases()->attach($validated['common_disease_ids']);
                Log::info('Attached common diseases to FDAR form', [
                    'fdar_form_id' => $fdarForm->id,
                    'common_disease_ids' => $validated['common_disease_ids']
                ]);
            }

            return redirect()->route('patients.index')->with('success', 'FDAR form created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing FDAR form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create FDAR form. Please try again.');
        }
    }
}
