<?php

namespace App\Http\Controllers;

use App\Models\DentalCertificate;
use App\Services\DentalCertificateDocxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DentalCertificateController extends Controller
{
    /**
     * Store a new dental certificate.
     */
    public function store(Request $request)
    {
        Log::info('Dental certificate submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized dental certificate submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user (School Nurse ID)
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit a dental certificate.');
            }

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'mouth_examination' => 'boolean',
                'gum_treatment' => 'boolean',
                'oral_prophylaxis' => 'boolean',
                'extraction' => 'boolean',
                'remarks' => 'nullable|string|max:255',
                'school_dentist_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            Log::info('Dental certificate validation passed', ['validated_data' => $validated]);

            // Create Dental Certificate
            $dentalCertificate = DentalCertificate::create([
                'patient_id' => $validated['patient_id'],
                'mouth_examination' => $validated['mouth_examination'] ?? false,
                'gum_treatment' => $validated['gum_treatment'] ?? false,
                'oral_prophylaxis' => $validated['oral_prophylaxis'] ?? false,
                'extraction' => $validated['extraction'] ?? false,
                'remarks' => $validated['remarks'],
                'school_nurse_id' => $clinicStaffId,
                'school_dentist_id' => $validated['school_dentist_id'],
                'recorded_by' => $recordedBy,
            ]);

            Log::info('Dental certificate created successfully', [
                'dental_certificate_id' => $dentalCertificate->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
                'school_dentist_id' => $validated['school_dentist_id'],
            ]);

            return redirect()->back()->with('success', 'Dental certificate created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing dental certificate', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create dental certificate. Please try again.');
        }
    }

    /**
     * Update an existing dental certificate.
     */
    public function update(Request $request, $id)
    {
        Log::info('Dental certificate update request received', ['dental_certificate_id' => $id, 'request_data' => $request->all()]);

        try {
            // Find the dental certificate to update
            $dentalCertificate = DentalCertificate::findOrFail($id);

            // Ensure user is authenticated
            $updatedBy = Auth::id();
            if (!$updatedBy) {
                Log::warning('Unauthorized dental certificate update attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Validate request data
            $validated = $request->validate([
                'mouth_examination' => 'boolean',
                'gum_treatment' => 'boolean',
                'oral_prophylaxis' => 'boolean',
                'extraction' => 'boolean',
                'remarks' => 'nullable|string|max:255',
                'school_dentist_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            Log::info('Dental certificate validation passed', ['validated_data' => $validated]);

            // Update the certificate fields
            $dentalCertificate->update([
                'mouth_examination' => $validated['mouth_examination'] ?? false,
                'gum_treatment' => $validated['gum_treatment'] ?? false,
                'oral_prophylaxis' => $validated['oral_prophylaxis'] ?? false,
                'extraction' => $validated['extraction'] ?? false,
                'remarks' => $validated['remarks'],
                'school_dentist_id' => $validated['school_dentist_id'],
                'updated_by' => $updatedBy,
            ]);

            Log::info('Dental certificate updated successfully', [
                'dental_certificate_id' => $dentalCertificate->id,
                'updated_by' => $updatedBy,
            ]);

            return redirect()->back()->with('success', 'Dental certificate updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating dental certificate', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to update dental certificate. Please try again.');
        }
    }

    /**
     * Delete a dental certificate.
     */
    public function destroy($id)
    {
        Log::info('Dental certificate delete request received', ['dental_certificate_id' => $id]);

        try {
            $dentalCertificate = DentalCertificate::findOrFail($id);
            $dentalCertificate->delete();

            Log::info('Dental certificate deleted successfully', ['dental_certificate_id' => $id]);

            return redirect()->back()->with('success', 'Dental certificate deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting dental certificate', [
                'dental_certificate_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete dental certificate. Please try again.');
        }
    }
        /**
     * Generate and return the PDF for a Dental Certificate.
     */
    public function viewPDF($id)
    {
        Log::info("📥 Fetching Dental Certificate details for PDF generation", [
            'dental_certificate_id' => $id
        ]);

        // ✅ Fetch dental certificate with necessary relationships
        $dentalCertificate = DentalCertificate::with([
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
            'schoolDentist' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            }
        ])->findOrFail($id);

        // ✅ Log fetched dental certificate details
        Log::info("✅ Dental Certificate retrieved successfully", [
            'dental_certificate' => $dentalCertificate->toArray()
        ]);

        // ✅ Log Patient Data
        Log::info("👤 Patient Data", ['patient' => $dentalCertificate->patient]);

        // ✅ Extract school dentist details
        $schoolDentist = $dentalCertificate->schoolDentist ? [
            'name' => "{$dentalCertificate->schoolDentist->fname} {$dentalCertificate->schoolDentist->lname}",
            'ext' => $dentalCertificate->schoolDentist->ext,
            'role' => $dentalCertificate->schoolDentist->role,
            'license_no' => $dentalCertificate->schoolDentist->license_no,
            'ptr_no' => $dentalCertificate->schoolDentist->ptr_no,
            'email' => $dentalCertificate->schoolDentist->email,
            'contact_no' => $dentalCertificate->schoolDentist->contact_no
        ] : [];

        Log::info("🦷 School Dentist Data", ['school_dentist' => $schoolDentist]);

        // ✅ Log before passing data to the service
        Log::info("📄 Passing data to generate Dental Certificate PDF", ['dental_certificate_id' => $id]);

        return DentalCertificateDocxService::generatePDF(
            $dentalCertificate->toArray(),
            $schoolDentist,
            "Dental_Certificate_{$id}.pdf"
        );
    }

    /**
     * Preview the generated PDF.
     */
    public function preview($id)
    {
        try {
            $dentalCertificate = DentalCertificate::findOrFail($id);
            return DentalCertificateDocxService::previewPDF($dentalCertificate);
        } catch (\Exception $e) {
            Log::error("❌ Error previewing Dental Certificate PDF: " . $e->getMessage());
            return back()->withErrors('Failed to preview dental certificate.');
        }
    }

}


