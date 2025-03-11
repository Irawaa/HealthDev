<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class IncidentReportController extends Controller
{
    /**
     * Store a new incident report.
     */
    public function store(Request $request)
    {
        Log::info('Incident report submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized incident report submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user (School Nurse ID)
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit an incident report.');
            }

            // Validate request data
                $validated = $request->validate([
                    'patient_id'            => 'required|exists:patients,patient_id',
                    'history'               => 'required|string',
                    'nature_of_incident'    => 'required|string|max:255',
                    'place_of_incident'     => 'required|string|max:255',
                    'date_of_incident'      => 'required|date',
                    'time_of_incident'      => 'required|date_format:H:i',
                    'description_of_injury' => 'nullable|string',
                    'management'            => 'required|in:In PNC,Referred to Hospital',
                    'hospital_specification'=> 'nullable|string|max:255',

                    // Only require school physician ID from request
                    'school_physician_id'   => 'required|exists:clinic_staffs,staff_id',
                ]);

            Log::info('Incident report validation passed', ['validated_data' => $validated]);

            // Create Incident Report
            $incidentReport = IncidentReport::create([
                'patient_id'            => $validated['patient_id'],
                'history'               => $validated['history'],
                'nature_of_incident'    => $validated['nature_of_incident'],
                'place_of_incident'     => $validated['place_of_incident'],
                'date_of_incident'      => $validated['date_of_incident'],
                'time_of_incident'      => $validated['time_of_incident'],
                'description_of_injury' => $validated['description_of_injury'],
                'management'            => $validated['management'],
                'hospital_specification'=> $validated['hospital_specification'],
                'school_nurse_id'       => $clinicStaffId, // ✅ Automatically set from authenticated user
                'school_physician_id'   => $validated['school_physician_id'],
                'recorded_by'           => $recordedBy,
            ]);

            Log::info('Incident report created', [
                'incident_report_id' => $incidentReport->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            return redirect()->route('patients.index')->with('success', 'Incident report created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing incident report', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create incident report. Please try again.');
        }
    }
}
