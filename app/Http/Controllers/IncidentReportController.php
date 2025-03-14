<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Services\IncidentReportDocxService;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

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
                'hospital_specification' => 'nullable|string|max:255',

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
                'hospital_specification' => $validated['hospital_specification'],
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

            return redirect()->back()->with('success', 'Incident report created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing incident report', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create incident report. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Incident report update request received', ['incident_report_id' => $id]);
    
        try {
            $incidentReport = IncidentReport::findOrFail($id);
    
            // Validate request data
            $validated = $request->validate([
                'history'               => 'required|string',
                'nature_of_incident'    => 'required|string|max:255',
                'place_of_incident'     => 'required|string|max:255',
                'date_of_incident'      => 'required|date',
                'time_of_incident'      => 'required|date_format:H:i',
                'description_of_injury' => 'nullable|string',
                'management'            => 'required|in:In PNC,Referred to Hospital',
                'hospital_specification' => 'nullable|string|max:255',
                'school_physician_id'   => 'required|exists:clinic_staffs,staff_id',
            ]);
    
            // Update Incident Report
            $incidentReport->update($validated);
    
            // Prepare for file handling
            $createdAt = isset($incidentReport['created_at'])
                ? Carbon::parse($incidentReport['created_at'])->format('Ymd_His')
                : now()->format('Ymd_His');
    
            $patientName = isset($incidentReport['patient']['fname'], $incidentReport['patient']['lname'])
                ? trim("{$incidentReport['patient']['fname']}_{$incidentReport['patient']['lname']}")
                : 'unknown_patient';
    
            $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
    
            // Paths for DOCX and PDF
            $storageDir = storage_path('app/generated');
            $incidentReportId = $incidentReport->id;
    
            // Generate file names for the DOCX and PDF
            $docxFilePath = "{$storageDir}/incident_report_{$incidentReportId}_{$patientName}_{$createdAt}.docx";
            $pdfFilePath = "{$storageDir}/incident_report_{$incidentReportId}_{$patientName}_{$createdAt}.pdf";
    
            // Check and delete old files if they exist
            if (File::exists($docxFilePath)) {
                File::delete($docxFilePath);
                Log::info("Deleted old DOCX file for incident report ID: {$incidentReportId}", ['file' => $docxFilePath]);
            }
    
            if (File::exists($pdfFilePath)) {
                File::delete($pdfFilePath);
                Log::info("Deleted old PDF file for incident report ID: {$incidentReportId}", ['file' => $pdfFilePath]);
            }
    
            // Regenerate the files if needed (optional)
            // This would depend on your use case for file regeneration
    
            Log::info('Incident report updated successfully', ['incident_report_id' => $id]);
    
            return redirect()->back()->with('success', 'Incident report updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating incident report', [
                'incident_report_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to update incident report. Please try again.');
        }
    }    

    /**
     * Delete an incident report.
     */
    public function destroy($id)
    {
        Log::info('Incident report delete request received', ['incident_report_id' => $id]);

        try {
            $incidentReport = IncidentReport::findOrFail($id);
            $incidentReport->delete();

            Log::info('Incident report deleted successfully', ['incident_report_id' => $id]);

            return redirect()->back()->with('success', 'Incident report deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting incident report', [
                'incident_report_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete incident report. Please try again.');
        }
    }

    public function viewPDF($id)
    {
        Log::info("Fetching Incident Report form details for PDF generation", ['incident_report_id' => $id]);

        // Fetch incident report with necessary relationships
        $incidentReport = IncidentReport::with([
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
            }
        ])->findOrFail($id);

        Log::info("Patient data:", ['patient' => $incidentReport->patient]);

        // Get school nurse and physician details
        $schoolNurse = $incidentReport->schoolNurse ? [
            'name' => "{$incidentReport->schoolNurse->fname} {$incidentReport->schoolNurse->lname}",
            'ext' => $incidentReport->schoolNurse->ext,
            'role' => $incidentReport->schoolNurse->role,
            'license_no' => $incidentReport->schoolNurse->license_no,
            'ptr_no' => $incidentReport->schoolNurse->ptr_no,
            'email' => $incidentReport->schoolNurse->email,
            'contact_no' => $incidentReport->schoolNurse->contact_no
        ] : [];

        $schoolPhysician = $incidentReport->schoolPhysician ? [
            'name' => "{$incidentReport->schoolPhysician->fname} {$incidentReport->schoolPhysician->lname}",
            'ext' => $incidentReport->schoolPhysician->ext,
            'role' => $incidentReport->schoolPhysician->role,
            'license_no' => $incidentReport->schoolPhysician->license_no,
            'ptr_no' => $incidentReport->schoolPhysician->ptr_no,
            'email' => $incidentReport->schoolPhysician->email,
            'contact_no' => $incidentReport->schoolPhysician->contact_no
        ] : [];

        // Log the retrieved data for debugging
        Log::info("Incident Report Form Data Retrieved", ['incident_report_id' => $incidentReport->toArray()]);

        // Pass the school nurse and school physician info to the generatePDF function
        return IncidentReportDocxService::generatePDF($incidentReport->toArray(), $schoolNurse, $schoolPhysician);
    }


    public function preview($id)
    {
        try {
            $incidentReport = IncidentReport::findOrFail($id);
            return IncidentReportDocxService::previewPDF($incidentReport);
        } catch (\Exception $e) {
            Log::error("Error previewing DOCX: " . $e->getMessage());
            return back()->withErrors('Failed to preview document.');
        }
    }
}
