<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryExamReferral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\LaboratoryExamReferralDocxService;

class LaboratoryExamReferralController extends Controller
{
    /**
     * Store a new Laboratory Exam Referral.
     */
    public function store(Request $request)
    {
        Log::info('Laboratory Exam Referral submission received', ['request_data' => $request->all()]);

        try {
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized laboratory exam referral submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit a laboratory exam referral.');
            }

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'x_ray' => 'boolean',
                'cbc' => 'boolean',
                'urinalysis' => 'boolean',
                'fecalysis' => 'boolean',
                'physical_examination' => 'boolean',
                'dental' => 'boolean',
                'hepatitis_b_screening' => 'boolean',
                'pregnancy_test' => 'boolean',
                'drug_test' => 'boolean',
                'magic_8' => 'boolean',
                'fbs' => 'boolean',
                'lipid_profile' => 'boolean',
                'bun' => 'boolean',
                'bua' => 'boolean',
                'creatine' => 'boolean',
                'sgpt' => 'boolean',
                'sgot' => 'boolean',
                'others' => 'nullable|string|max:255',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            Log::info('Laboratory Exam Referral validation passed', ['validated_data' => $validated]);

            // Create a new Laboratory Exam Referral
            $examReferral = LaboratoryExamReferral::create([
                ...$validated,
                'school_nurse_id' => $clinicStaffId,
                'recorded_by' => $recordedBy,
            ]);

            Log::info('Laboratory Exam Referral created', ['exam_referral_id' => $examReferral->id]);

            return redirect()->back()->with('success', 'Laboratory exam referral created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing Laboratory Exam Referral', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create laboratory exam referral. Please try again.');
        }
    }

    /**
     * Update an existing Laboratory Exam Referral.
     */
    public function update(Request $request, $id)
    {
        Log::info('Laboratory Exam Referral update request received', ['exam_referral_id' => $id]);

        try {
            $examReferral = LaboratoryExamReferral::findOrFail($id);

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'x_ray' => 'boolean',
                'cbc' => 'boolean',
                'urinalysis' => 'boolean',
                'fecalysis' => 'boolean',
                'physical_examination' => 'boolean',
                'dental' => 'boolean',
                'hepatitis_b_screening' => 'boolean',
                'pregnancy_test' => 'boolean',
                'drug_test' => 'boolean',
                'magic_8' => 'boolean',
                'fbs' => 'boolean',
                'lipid_profile' => 'boolean',
                'bun' => 'boolean',
                'bua' => 'boolean',
                'creatine' => 'boolean',
                'sgpt' => 'boolean',
                'sgot' => 'boolean',
                'others' => 'nullable|string|max:255',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            // Update the Laboratory Exam Referral
            $examReferral->update($validated);

            Log::info('Laboratory Exam Referral updated successfully', ['exam_referral_id' => $examReferral->id]);

            return redirect()->back()->with('success', 'Laboratory exam referral updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating Laboratory Exam Referral', [
                'exam_referral_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors('Failed to update laboratory exam referral. Please try again.');
        }
    }

    /**
     * Delete a Laboratory Exam Referral.
     */
    public function destroy($id)
    {
        Log::info('Laboratory Exam Referral delete request received', ['exam_referral_id' => $id]);

        try {
            $examReferral = LaboratoryExamReferral::findOrFail($id);
            $examReferral->delete();

            Log::info('Laboratory Exam Referral deleted successfully', ['exam_referral_id' => $id]);

            return redirect()->back()->with('success', 'Laboratory exam referral deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting Laboratory Exam Referral', [
                'exam_referral_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete laboratory exam referral. Please try again.');
        }
    }

    public function viewPDF($id)
    {
        Log::info("📥 Fetching Laboratory Exam Referral details for PDF generation", [
            'lab_exam_referral_id' => $id
        ]);

        // ✅ Fetch lab referral with necessary relationships
        $labReferral = LaboratoryExamReferral::with([
            'patient' => function ($query) {
                $query->with([
                    'student' => function ($q) {
                        $q->select(
                            'patient_id',
                            'stud_id',
                            'address_house',
                            'address_brgy',
                            'address_citytown',
                            'address_province',
                            'address_zipcode',
                            'emergency_contact_name',
                            'emergency_contact_no',
                            'guardian_relation',
                            'program_id',
                            'college_id'
                        )->with(['program', 'college']);
                    },
                    'personnel' => function ($q) {
                        $q->select(
                            'patient_id',
                            'employee_id',
                            'res_brgy',
                            'res_city',
                            'res_prov',
                            'res_region',
                            'res_zipcode',
                            'dept_id',
                            'college_id',
                            'emergency_contact_person',
                            'emergency_contact_number',
                        )->with(['department', 'college']);
                    },
                    'nonpersonnel' => function ($q) {
                        $q->select('patient_id', 'affiliation');
                    }
                ]);
            },
            'recordedBy',
            'schoolPhysician' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            },
            'schoolNurse' => function ($query) {
                $query->select('staff_id', 'fname', 'lname', 'role', 'ext', 'license_no', 'ptr_no', 'email', 'contact_no');
            }
        ])->findOrFail($id);

        // ✅ Log fetched lab referral details
        Log::info("✅ Lab Exam Referral retrieved successfully", [
            'lab_exam_referral' => $labReferral->toArray()
        ]);

        // ✅ Log Patient Data
        Log::info("👤 Patient Data", ['patient' => $labReferral->patient]);

        // ✅ Extract school physician details
        $schoolPhysician = $labReferral->schoolPhysician ? [
            'name' => "{$labReferral->schoolPhysician->fname} {$labReferral->schoolPhysician->lname}",
            'ext' => $labReferral->schoolPhysician->ext,
            'role' => $labReferral->schoolPhysician->role,
            'license_no' => $labReferral->schoolPhysician->license_no,
            'ptr_no' => $labReferral->schoolPhysician->ptr_no,
            'email' => $labReferral->schoolPhysician->email,
            'contact_no' => $labReferral->schoolPhysician->contact_no
        ] : [];

        Log::info("🩺 School Physician Data", ['school_physician' => $schoolPhysician]);

        // ✅ Extract school nurse details
        $schoolNurse = $labReferral->schoolNurse ? [
            'name' => "{$labReferral->schoolNurse->fname} {$labReferral->schoolNurse->lname}",
            'ext' => $labReferral->schoolNurse->ext,
            'role' => $labReferral->schoolNurse->role,
            'license_no' => $labReferral->schoolNurse->license_no,
            'ptr_no' => $labReferral->schoolNurse->ptr_no,
            'email' => $labReferral->schoolNurse->email,
            'contact_no' => $labReferral->schoolNurse->contact_no
        ] : [];

        Log::info("👩‍⚕️ School Nurse Data", ['school_nurse' => $schoolNurse]);

        // ✅ Log before passing data to the service
        Log::info("📄 Passing data to generate Laboratory Exam Referral PDF", ['lab_exam_referral_id' => $id]);

        return LaboratoryExamReferralDocxService::generatePDF(
            labReferral: $labReferral->toArray(),
        );
    }
}
