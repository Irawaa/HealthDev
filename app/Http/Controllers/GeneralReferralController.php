<?php

namespace App\Http\Controllers;

use App\Models\GeneralReferral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GeneralReferralController extends Controller
{
    /**
     * Store a new General Referral.
     */
    public function store(Request $request)
    {
        Log::info('General Referral submission received', ['request_data' => $request->all()]);

        try {
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized general referral submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit a general referral.');
            }

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'to' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'examined_on' => 'required|date',
                'examined_due_to' => 'required|string|max:255',
                'duration' => 'nullable|numeric|min:1',
                'impression' => 'nullable|string|max:255',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            Log::info('General Referral validation passed', ['validated_data' => $validated]);

            // Create a new General Referral
            $generalReferral = GeneralReferral::create([
                ...$validated,
                'school_nurse_id' => $clinicStaffId,
                'recorded_by' => $recordedBy,
            ]);

            Log::info('General Referral created', ['general_referral_id' => $generalReferral->id]);

            return redirect()->back()->with('success', 'General referral created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing General Referral', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create general referral. Please try again.');
        }
    }

    /**
     * Update an existing General Referral.
     */
    public function update(Request $request, $id)
    {
        Log::info('General Referral update request received', ['general_referral_id' => $id]);

        try {
            $generalReferral = GeneralReferral::findOrFail($id);

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'to' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'examined_on' => 'required|date',
                'examined_due_to' => 'required|string|max:255',
                'duration' => 'nullable|numeric|min:1',
                'impression' => 'nullable|string|max:255',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            // Update the General Referral
            $generalReferral->update($validated);

            Log::info('General Referral updated successfully', ['general_referral_id' => $generalReferral->id]);

            return redirect()->back()->with('success', 'General referral updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating General Referral', [
                'general_referral_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors('Failed to update general referral. Please try again.');
        }
    }

    /**
     * Delete a General Referral.
     */
    public function destroy($id)
    {
        Log::info('General Referral delete request received', ['general_referral_id' => $id]);

        try {
            $generalReferral = GeneralReferral::findOrFail($id);
            $generalReferral->delete();

            Log::info('General Referral deleted successfully', ['general_referral_id' => $id]);

            return redirect()->back()->with('success', 'General referral deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting General Referral', [
                'general_referral_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete general referral. Please try again.');
        }
    }
}
