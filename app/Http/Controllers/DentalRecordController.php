<?php

namespace App\Http\Controllers;


use App\Models\DentalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class DentalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Dental record submission initiated', ['request' => $request->all()]);

        // Get the authenticated clinic staff (nurse or dentist)
        $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
        if (!$clinicStaffId) {
            Log::warning('Unauthorized clinic staff attempt.');
            return back()->withErrors('You are not authorized to submit a dental record.');
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_dentist_id' => 'required|exists:clinic_staffs,staff_id',
                'gingival_status' => 'required|in:Normal,Gingivitis,Periodontitis',
                'periodontitis_severity' => 'nullable|in:Early,Moderate,Severe',
                'plaque_deposit' => 'required|in:Light,Moderate,Heavy',
                'other_treatments' => 'nullable|string',
                'recommended_treatment' => 'nullable|string',
            ]);

            // Recorded by authenticated user
            $recordedBy = Auth::id();

            $dentalRecordChart = $request->input('dental_record_chart');

            // // Attempt to convert the dental_record_chart to valid JSON
            // if (is_string($dentalRecordChart)) {
            //     json_decode($dentalRecordChart);

            //     if (json_last_error() !== JSON_ERROR_NONE) {
            //         try {
            //             // Attempt to convert to JSON string
            //             $dentalRecordChart = json_encode($dentalRecordChart);

            //             // Check if conversion succeeded
            //             json_decode($dentalRecordChart);
            //             if (json_last_error() !== JSON_ERROR_NONE) {
            //                 Log::error('Invalid JSON after conversion', ['error' => json_last_error_msg()]);
            //                 return back()->withErrors('The dental_record_chart must be a valid JSON string.');
            //             }
            //         } catch (\Exception $e) {
            //             Log::error('Failed to convert dental_record_chart to JSON', ['message' => $e->getMessage()]);
            //             return back()->withErrors('Failed to process the dental record chart.');
            //         }
            //     }
            // } elseif (is_array($dentalRecordChart)) {
            //     // If it's an array, encode it to JSON
            //     $dentalRecordChart = json_encode($dentalRecordChart);
            // } else {
            //     Log::error('Invalid dental_record_chart format', ['type' => gettype($dentalRecordChart)]);
            //     return back()->withErrors('The dental_record_chart must be a valid JSON string.');
            // }

            // Create the dental record
            $dentalRecord = DentalRecord::create([
                'patient_id' => $validated['patient_id'],
                'school_dentist_id' => $validated['school_dentist_id'],
                'school_nurse_id' => $clinicStaffId,
                'gingival_status' => $validated['gingival_status'],
                'periodontitis_severity' => $validated['periodontitis_severity'] ?? null,
                'plaque_deposit' => $validated['plaque_deposit'],
                'other_treatments' => $validated['other_treatments'] ?? null,
                'recommended_treatment' => $validated['recommended_treatment'] ?? null,
                'dental_record_chart' => $dentalRecordChart,
                'recorded_by' => $recordedBy,
                'updated_by' => $recordedBy,
            ]);

            Log::info('Dental record successfully created', ['dental_record' => $dentalRecord]);

            return redirect()->back()->with('success', 'Dental record created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create dental record', ['message' => $e->getMessage()]);
            return back()->withErrors('Failed to create dental record. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(DentalRecord $dentalRecord)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DentalRecord $dentalRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DentalRecord $dentalRecord)
    {
        Log::info('Dental record update initiated', ['dental_record_id' => $dentalRecord->id, 'request' => $request->all()]);

        // Get the authenticated clinic staff (nurse or dentist)
        $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
        if (!$clinicStaffId) {
            Log::warning('Unauthorized clinic staff attempt to update.');
            return back()->withErrors('You are not authorized to update this dental record.');
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_dentist_id' => 'required|exists:clinic_staffs,staff_id',
                'gingival_status' => 'required|in:Normal,Gingivitis,Periodontitis',
                'periodontitis_severity' => 'nullable|in:Early,Moderate,Severe',
                'plaque_deposit' => 'required|in:Light,Moderate,Heavy',
                'other_treatments' => 'nullable|string',
                'recommended_treatment' => 'nullable|string',
            ]);

            $updatedBy = Auth::id();
            $dentalRecordChart = $request->input('dental_record_chart');

            // Update the dental record
            $dentalRecord->update([
                'patient_id' => $validated['patient_id'],
                'school_dentist_id' => $validated['school_dentist_id'],
                'school_nurse_id' => $clinicStaffId,
                'gingival_status' => $validated['gingival_status'],
                'periodontitis_severity' => $validated['periodontitis_severity'] ?? null,
                'plaque_deposit' => $validated['plaque_deposit'],
                'other_treatments' => $validated['other_treatments'] ?? null,
                'recommended_treatment' => $validated['recommended_treatment'] ?? null,
                'dental_record_chart' => $dentalRecordChart,
                'updated_by' => $updatedBy,
            ]);

            Log::info('Dental record successfully updated', ['dental_record_id' => $dentalRecord->id]);

            return redirect()->back()->with('success', 'Dental record updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update dental record', [
                'dental_record_id' => $dentalRecord->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors('Failed to update the dental record. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DentalRecord $dentalRecord)
    {
        try {
            // Log the initiation of the delete process
            Log::info('Initiating deletion of dental record', ['dental_record_id' => $dentalRecord->id]);

            // Perform the deletion
            $dentalRecord->delete();

            Log::info('Dental record successfully deleted', ['dental_record_id' => $dentalRecord->id]);

            return redirect()->back()->with('success', 'Dental record deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete dental record', [
                'dental_record_id' => $dentalRecord->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors('Failed to delete the dental record. Please try again.');
        }
    }
}
