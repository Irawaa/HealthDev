<?php

namespace App\Http\Controllers;

use App\Models\BPForm;
use App\Models\BPReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\BPFormDocxService;

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
                return back()->withErrors('Unauthorized action.');
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

            return redirect()->back()->with('success', 'BP form created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing BP form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create BP form. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('BP form update received', ['request_data' => $request->all(), 'bp_form_id' => $id]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized BP form update attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'status' => 'nullable|string|max:50',
                'readings' => 'required|array',
                'readings.*.id' => 'nullable|exists:bp_readings,id', // Optional ID for existing readings
                'readings.*.date' => 'required|date',
                'readings.*.time' => 'required|date_format:H:i:s',
                'readings.*.blood_pressure' => 'required|string|max:10',
                'readings.*.has_signature' => 'nullable|boolean',
                'readings.*.remarks' => 'nullable|string',
            ]);

            Log::info('BP form validation passed', ['validated_data' => $validated]);

            // Find the BPForm record
            $bpForm = BPForm::findOrFail($id);

            // Update BP form record
            $bpForm->update([
                'patient_id' => $validated['patient_id'],
                'school_nurse_id' => $clinicStaffId,
                'recorded_by' => $recordedBy,
                'status' => $validated['status'] ?? 'Stable',
            ]);

            Log::info('BP form updated', ['bp_form_id' => $bpForm->id]);

            // Process the readings
            $existingReadings = $bpForm->readings()->pluck('id')->toArray(); // Get existing reading IDs
            $newReadings = collect($validated['readings']); // Get new readings data

            // Delete readings that are no longer in the request (i.e., marked for deletion)
            foreach ($existingReadings as $readingId) {
                if (!$newReadings->contains('id', $readingId)) {
                    BPReading::find($readingId)->delete();  // Delete reading if not in new request
                }
            }

            // Store or update BP Readings
            foreach ($newReadings as $reading) {
                if (isset($reading['id'])) {
                    // Update existing reading
                    $existingReading = BPReading::find($reading['id']);
                    if ($existingReading) {
                        $existingReading->update($reading);
                        Log::info('BP reading updated', ['bp_reading_id' => $existingReading->id]);
                    }
                } else {
                    // Create new reading
                    BPReading::create(array_merge($reading, ['bp_form_id' => $bpForm->id]));
                    Log::info('BP reading created', ['bp_form_id' => $bpForm->id]);
                }
            }

            return redirect()->back()->with('success', 'BP form updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating BP form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to update BP form. Please try again.');
        }
    }

    public function destroy($id)
    {
        Log::info('Deleting BP form', ['bp_form_id' => $id]);

        try {
            // Find the BPForm record by ID
            $bpForm = BPForm::findOrFail($id);

            // Delete associated BP readings
            foreach ($bpForm->readings as $reading) {
                $reading->delete();
                Log::info('Deleted BP reading', ['bp_reading_id' => $reading->id]);
            }

            // Now delete the BP form itself
            $bpForm->delete();

            Log::info('BP form deleted successfully', ['bp_form_id' => $bpForm->id]);

            return redirect()->back()->with('success', 'BP form deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting BP form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete BP form. Please try again.');
        }
    }

    public function viewPDF($id)
    {
        Log::info("Fetching BP form details for PDF generation", ['bp_form_id' => $id]);

        // Retrieve BP form with the related data
        $bpForm = BPForm::with([
            'patient' => function ($query) {
                $query->with([
                    'student' => function ($q) {
                        $q->select('patient_id', 'stud_id', 'address_house', 'address_brgy', 'address_citytown', 'address_province', 'address_zipcode', 'program_id', 'college_id')
                            ->with(['program', 'college']);
                    },
                    'personnel' => function ($q) {
                        $q->select('patient_id', 'employee_id', 'res_brgy', 'res_city', 'res_prov', 'res_region', 'res_zipcode', 'dept_id', 'college_id')
                            ->with(['department', 'college']);
                    },
                    'nonpersonnel' => function ($q) {
                        $q->select('patient_id', 'affiliation');
                    }
                ]);
            },
            'recordedBy',
            // Load the school nurse and school physician info with additional details
            'schoolNurse' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            },
            'schoolPhysician' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            },
            'readings'
        ])->findOrFail($id);

        // Log the retrieved data for debugging
        Log::info("BP Form Data Retrieved", ['bp_form' => $bpForm->toArray()]);

        // Get school nurse and physician details
        $schoolNurse = $bpForm->schoolNurse ? [
            'name' => "{$bpForm->schoolNurse->fname} {$bpForm->schoolNurse->lname}",
            'ext' => $bpForm->schoolNurse->ext,
            'role' => $bpForm->schoolNurse->role,
            'license_no' => $bpForm->schoolNurse->license_no,
            'ptr_no' => $bpForm->schoolNurse->ptr_no,
            'email' => $bpForm->schoolNurse->email,
            'contact_no' => $bpForm->schoolNurse->contact_no
        ] : [];

        $schoolPhysician = $bpForm->schoolPhysician ? [
            'name' => "{$bpForm->schoolPhysician->fname} {$bpForm->schoolPhysician->lname}",
            'ext' => $bpForm->schoolPhysician->ext,
            'role' => $bpForm->schoolPhysician->role,
            'license_no' => $bpForm->schoolPhysician->license_no,
            'ptr_no' => $bpForm->schoolPhysician->ptr_no,
            'email' => $bpForm->schoolPhysician->email,
            'contact_no' => $bpForm->schoolPhysician->contact_no
        ] : [];

        // Log the patient info for debugging
        Log::info("Patient data:", ['patient' => $bpForm->patient]);

        // Pass the patient and staff details to the generatePDF function
        return BPFormDocxService::generatePDF($bpForm->toArray(), $schoolNurse, $schoolPhysician);
    }

    public function preview($id)
    {
        try {
            // Retrieve BP form for preview
            $bpForm = BPForm::findOrFail($id);

            // Preview the PDF using the BPDocxService
            return BPFormDocxService::previewPDF($bpForm);
        } catch (\Exception $e) {
            Log::error("Error previewing BP form: " . $e->getMessage());
            return back()->withErrors('Failed to preview BP document.');
        }
    }
}
