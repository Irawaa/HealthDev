<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryExamReferral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
}
