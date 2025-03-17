<?php

namespace App\Http\Controllers;

use App\Models\MedicalCertificate;
use App\Services\MedicalCertificateDocxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MedicalCertificateController extends Controller
{
    /**
     * Store a new medical certificate.
     */
    public function store(Request $request)
    {
        Log::info('Medical certificate submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized medical certificate submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user (School Nurse ID)
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit a medical certificate.');
            }

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'diagnosis' => 'required|string',
                'advised_medication_rest_required' => 'boolean',
                'advised_medication_rest' => 'nullable|date|required_if:advised_medication_rest_required,true',
                'purpose' => 'required|in:Excuse Slip,Off School Duty,OJT,Sports,ROTC,Others',
                'purpose_other' => 'nullable|string|max:255',
                'recommendation' => 'required|integer|between:0,2', // 0: Return to Class, 1: Sent Home, 2: To Hospital
                'clearance_status' => 'required|integer|between:0,2', // 0: Fit, 1: Evaluation Needed, 2: Not Cleared
                'further_evaluation' => 'nullable|string|max:255',
                'not_cleared_for' => 'nullable|in:All sports,Certain sports,Activity',
                'activity_specification' => 'nullable|string|max:255',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            Log::info('Medical certificate validation passed', ['validated_data' => $validated]);

            // Create Medical Certificate
            $medicalCertificate = MedicalCertificate::create([
                'patient_id' => $validated['patient_id'],
                'diagnosis' => $validated['diagnosis'],
                'advised_medication_rest_required' => $validated['advised_medication_rest_required'],
                'advised_medication_rest' => $validated['advised_medication_rest'],
                'purpose' => $validated['purpose'],
                'purpose_other' => $validated['purpose_other'],
                'recommendation' => $validated['recommendation'],
                'clearance_status' => $validated['clearance_status'],
                'further_evaluation' => $validated['further_evaluation'],
                'not_cleared_for' => $validated['not_cleared_for'],
                'activity_specification' => $validated['activity_specification'],
                'school_nurse_id' => $clinicStaffId, // ✅ Automatically set from authenticated user
                'school_physician_id' => $validated['school_physician_id'],
                'recorded_by' => $recordedBy,
            ]);

            Log::info('Medical certificate created', [
                'medical_certificate_id' => $medicalCertificate->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            return redirect()->back()->with('success', 'Medical certificate created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing medical certificate', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create medical certificate. Please try again.');
        }
    }

    /**
     * Delete a medical certificate.
     */
    public function destroy($id)
    {
        Log::info('Medical certificate delete request received', ['medical_certificate_id' => $id]);

        try {
            $medicalCertificate = MedicalCertificate::findOrFail($id);
            $medicalCertificate->delete();

            Log::info('Medical certificate deleted successfully', ['medical_certificate_id' => $id]);

            return redirect()->back()->with('success', 'Medical certificate deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting medical certificate', [
                'medical_certificate_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete medical certificate. Please try again.');
        }
    }

    /**
     * Generate and return the PDF for a Medical Certificate.
     */
    public function viewPDF($id)
    {
        Log::info("📥 Fetching Medical Certificate details for PDF generation", [
            'medical_certificate_id' => $id
        ]);


        // ✅ Fetch medical certificate with necessary relationships
        $medicalCertificate = MedicalCertificate::with([
            'patient' => function ($query) {
                $query->with([
                    'student' => function ($q) {
                        $q->select('patient_id', 'stud_id', 'address_house', 'address_brgy', 'address_citytown', 'address_province', 'address_zipcode', 'emergency_contact_name', 'emergency_contact_no', 'guardian_relation', 'program_id', 'college_id')
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
            'schoolNurse' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            },
            'schoolPhysician' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            }
        ])->findOrFail($id);

        // ✅ Log fetched medical certificate details
        Log::info("✅ Medical Certificate retrieved successfully", [
            'medical_certificate' => $medicalCertificate->toArray()
        ]);

        // ✅ Log Patient Data
        Log::info("👤 Patient Data", ['patient' => $medicalCertificate->patient]);

        // ✅ Extract school nurse details
        $schoolNurse = $medicalCertificate->schoolNurse ? [
            'name' => "{$medicalCertificate->schoolNurse->fname} {$medicalCertificate->schoolNurse->lname}",
            'ext' => $medicalCertificate->schoolNurse->ext,
            'role' => $medicalCertificate->schoolNurse->role,
            'license_no' => $medicalCertificate->schoolNurse->license_no,
            'ptr_no' => $medicalCertificate->schoolNurse->ptr_no,
            'email' => $medicalCertificate->schoolNurse->email,
            'contact_no' => $medicalCertificate->schoolNurse->contact_no
        ] : [];

        Log::info("👩‍⚕️ School Nurse Data", ['school_nurse' => $schoolNurse]);

        // ✅ Extract school physician details
        $schoolPhysician = $medicalCertificate->schoolPhysician ? [
            'name' => "{$medicalCertificate->schoolPhysician->fname} {$medicalCertificate->schoolPhysician->lname}",
            'ext' => $medicalCertificate->schoolPhysician->ext,
            'role' => $medicalCertificate->schoolPhysician->role,
            'license_no' => $medicalCertificate->schoolPhysician->license_no,
            'ptr_no' => $medicalCertificate->schoolPhysician->ptr_no,
            'email' => $medicalCertificate->schoolPhysician->email,
            'contact_no' => $medicalCertificate->schoolPhysician->contact_no
        ] : [];

        Log::info(message: "👨‍⚕️ School Physician Data", context: ['school_physician' => $schoolPhysician]);

        // ✅ Log before passing data to the service
        Log::info(message: "📄 Passing data to generate Medical Certificate PDF", context: ['medical_certificate_id' => $id]);

        return MedicalCertificateDocxService::generatePDF(
            data: $medicalCertificate->toArray(),
            schoolNurse: $schoolNurse,
            schoolPhysician: $schoolPhysician
        );
    }

    /**
     * Preview the generated PDF.
     */
    public function preview($id)
    {
        try {
            $medicalCertificate = MedicalCertificate::findOrFail($id);
            return MedicalCertificateDocxService::previewPDF($medicalCertificate);
        } catch (\Exception $e) {
            Log::error("Error previewing Medical Certificate PDF: " . $e->getMessage());
            return back()->withErrors('Failed to preview medical certificate.');
        }
    }
}




/**
 * Update a medical certificate.
 */
// public function update(Request $request, $id)
// {
//     Log::info('Medical certificate update request received', ['medical_certificate_id' => $id]);

//     try {
//         $medicalCertificate = MedicalCertificate::findOrFail($id);

//         // Validate request data
//         $validated = $request->validate([
//             'diagnosis' => 'required|string',
//             'advised_medication_rest_required' => 'boolean',
//             'advised_medication_rest' => 'nullable|date|required_if:advised_medication_rest_required,true',
//             'purpose' => 'required|in:Excuse Slip,Off School Duty,OJT,Sports,ROTC,Others',
//             'purpose_other' => 'nullable|string|max:255',
//             'recommendation' => 'required|integer|between:0,2',
//             'clearance_status' => 'required|integer|between:0,2',
//             'further_evaluation' => 'nullable|string|max:255',
//             'not_cleared_for' => 'nullable|in:All sports,Certain sports,Activity',
//             'activity_specification' => 'nullable|string|max:255',
//             'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
//         ]);

//         // Update Medical Certificate
//         $medicalCertificate->update($validated);

//         Log::info('Medical certificate updated successfully', ['medical_certificate_id' => $id]);

//         return redirect()->back()->with('success', 'Medical certificate updated successfully');
//     } catch (\Exception $e) {
//         Log::error('Error updating medical certificate', [
//             'medical_certificate_id' => $id,
//             'message' => $e->getMessage(),
//             'trace' => $e->getTraceAsString()
//         ]);
//         return back()->withErrors('Failed to update medical certificate. Please try again.');
//     }
// }