<?php

namespace App\Http\Controllers;

use App\Models\BPForm;
use App\Models\BPReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BPFormController extends Controller
{
    public function store(Request $request)
    {
        Log::info('BP form submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized BP form submission attempt.');
                return redirect()->back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'status' => 'nullable|string|max:50',
                'readings' => 'required|array',
                'readings.*.date' => 'required|date',
                'readings.*.time' => 'required|date_format:H:i',
                'readings.*.blood_pressure' => 'required|string|max:10',
                'readings.*.has_signature' => 'nullable|boolean',
                'readings.*.remarks' => 'nullable|string',
            ]);

            Log::info('BP form validation passed', ['validated_data' => $validated]);

            // Create BP form record
            $bpForm = BPForm::create([
                'patient_id' => $validated['patient_id'],
                'school_nurse_id' => $clinicStaffId,
                'recorded_by' => $recordedBy,
                'status' => $validated['status'] ?? 'Stable',
            ]);

            Log::info('BP form created', [
                'bp_form_id' => $bpForm->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            // Store BP Readings
            foreach ($validated['readings'] as $reading) {
                BPReading::create(array_merge($reading, ['bp_form_id' => $bpForm->id]));
            }

            Log::info('BP readings stored', ['bp_form_id' => $bpForm->id]);

            return redirect()->route('patients.index')->with('success', 'BP form created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing BP form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors('Failed to create BP form. Please try again.');
        }
    }
}
