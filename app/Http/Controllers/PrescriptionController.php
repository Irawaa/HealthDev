<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class PrescriptionController extends Controller
{
    /**
     * Store a new prescription.
     */
    public function store(Request $request)
    {
        Log::info('Prescription submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized prescription submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user (School Nurse ID)
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
            if (!$clinicStaffId) {
                Log::warning('Authenticated user is not linked to clinic staff.');
                return back()->withErrors('You are not authorized to submit a prescription.');
            }

            // Validate request data
            $validated = $request->validate([
                'patient_id'          => 'required|exists:patients,patient_id',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
                'prescription_image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // ✅ Image validation applied
            ]);

            Log::info('Prescription validation passed', ['validated_data' => $validated]);

            // Store Prescription Image as Binary Blob
            $prescriptionImage = null;
            if ($request->hasFile('prescription_image')) {
                $prescriptionImage = $request->file('prescription_image')->getContent();
            }

            // Create Prescription
            $prescription = Prescription::create([
                'patient_id'          => $validated['patient_id'],
                'school_nurse_id'     => $clinicStaffId, // ✅ Automatically set from authenticated user
                'school_physician_id' => $validated['school_physician_id'],
                'prescription_image'  => $prescriptionImage, // ✅ Store as binary blob
                'recorded_by'         => $recordedBy,
                'prescription_number' => null,
            ]);

            Log::info('Prescription created', [
                'prescription_id' => $prescription->id,
                'patient_id'      => $validated['patient_id'],
                'recorded_by'     => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            return redirect()->back()->with('success', 'Prescription created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing prescription', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create prescription. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Prescription update request received', ['prescription_id' => $id]);

        try {
            $prescription = Prescription::findOrFail($id);

            // Validate request data
            $validated = $request->validate([
                'prescription_image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // ✅ Image validation applied
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
            ]);

            // Store Prescription Image as Binary Blob if provided
            if ($request->hasFile('prescription_image')) {
                $prescription->prescription_image = $request->file('prescription_image')->getContent();
            }

            // Update Prescription
            $prescription->update([
                'school_physician_id' => $validated['school_physician_id'],
                'updated_by'          => Auth::id(),
            ]);

            Log::info('Prescription updated successfully', ['prescription_id' => $id]);

            return redirect()->back()->with('success', 'Prescription updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating prescription', [
                'prescription_id' => $id,
                'message'         => $e->getMessage(),
                'trace'           => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to update prescription. Please try again.');
        }
    }

    public function destroy($id)
    {
        Log::info('Prescription delete request received', ['prescription_id' => $id]);

        try {
            $prescription = Prescription::findOrFail($id);
            $prescription->delete();

            Log::info('Prescription deleted successfully', ['prescription_id' => $id]);

            return redirect()->back()->with('success', 'Prescription deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting prescription', [
                'prescription_id' => $id,
                'message'         => $e->getMessage(),
                'trace'           => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete prescription. Please try again.');
        }
    }

    public function showImage($id)
    {
        $prescription = Prescription::findOrFail($id);

        if (!$prescription->prescription_image) {
            return response()->json(['error' => 'No image found'], 404);
        }

        return response($prescription->prescription_image)
            ->header('Content-Type', 'image/jpeg'); // Adjust MIME type dynamically if needed
    }
}
