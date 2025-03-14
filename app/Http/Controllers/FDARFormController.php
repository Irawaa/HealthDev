<?php

namespace App\Http\Controllers;

use App\Models\FDARForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Services\FDARDocxService;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

class FDARFormController extends Controller
{
    public function store(Request $request)
    {
        Log::info('FDAR form submission received', ['request_data' => $request->all()]);

        try {
            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized FDAR form submission attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Get clinic staff ID from authenticated user
            $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;

            // Validate request data
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_nurse_id' => 'nullable|exists:clinic_staffs,staff_id',
                'data' => 'required|string',
                'action' => 'required|string',
                'response' => 'required|string',
                'weight' => 'nullable|numeric',
                'height' => 'nullable|numeric',
                'blood_pressure' => 'nullable|string',
                'cardiac_rate' => 'nullable|numeric',
                'respiratory_rate' => 'nullable|numeric',
                'temperature' => 'nullable|numeric',
                'oxygen_saturation' => 'nullable|numeric',
                'last_menstrual_period' => 'nullable|date',
                'common_disease_ids' => 'nullable|array',
                'common_disease_ids.*' => 'exists:common_diseases,id',
                'custom_diseases' => 'nullable|array', // ✅ Allow custom diseases
                'custom_diseases.*' => 'string|max:255', // ✅ Each custom disease must be a string
            ]);

            Log::info('FDAR form validation passed', ['validated_data' => $validated]);

            // Create FDAR form record
            $fdarForm = FDARForm::create(array_merge($validated, [
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId, // Assign clinic staff ID
            ]));

            Log::info('FDAR form created', [
                'fdar_form_id' => $fdarForm->id,
                'patient_id' => $validated['patient_id'],
                'recorded_by' => $recordedBy,
                'school_nurse_id' => $clinicStaffId,
            ]);

            // ✅ Attach Common Diseases (if provided)
            if (!empty($validated['common_disease_ids'])) {
                $fdarForm->commonDiseases()->attach($validated['common_disease_ids']);
                Log::info('Attached common diseases to FDAR form', [
                    'fdar_form_id' => $fdarForm->id,
                    'common_disease_ids' => $validated['common_disease_ids']
                ]);
            }

            // ✅ Store Custom Diseases (if provided)
            if (!empty($validated['custom_diseases'])) {
                foreach ($validated['custom_diseases'] as $customDisease) {
                    DB::table('fdar_form_common_disease')->insert([
                        'fdar_form_id' => $fdarForm->id,
                        'common_disease_id' => null, // No predefined disease
                        'custom_disease' => $customDisease, // Store the custom disease
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                Log::info('Stored custom diseases for FDAR form', [
                    'fdar_form_id' => $fdarForm->id,
                    'custom_diseases' => $validated['custom_diseases']
                ]);
            }

            return redirect()->back()->with('success', 'FDAR form created successfully');
        } catch (\Exception $e) {
            Log::error('Error storing FDAR form', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to create FDAR form. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('FDAR form update request received', ['fdar_form_id' => $id, 'request_data' => $request->all()]);

        try {
            // Ensure FDAR form exists
            $fdarForm = FDARForm::findOrFail($id);

            // Ensure user is authenticated
            $recordedBy = Auth::id();
            if (!$recordedBy) {
                Log::warning('Unauthorized FDAR form update attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Validate request data
            $validated = $request->validate([
                'data' => 'required|string',
                'action' => 'required|string',
                'response' => 'required|string',
                'weight' => 'nullable|numeric',
                'height' => 'nullable|numeric',
                'blood_pressure' => 'nullable|string',
                'cardiac_rate' => 'nullable|numeric',
                'respiratory_rate' => 'nullable|numeric',
                'temperature' => 'nullable|numeric',
                'oxygen_saturation' => 'nullable|numeric',
                'last_menstrual_period' => 'nullable|date',
                'common_disease_ids' => 'nullable|array',
                'common_disease_ids.*' => 'exists:common_diseases,id',
                'custom_diseases' => 'nullable|array',
                'custom_diseases.*' => 'string|max:255',
            ]);

            Log::info('FDAR form validation passed', ['validated_data' => $validated]);

            // Update FDAR form record
            $fdarForm->update($validated);
            Log::info('FDAR form updated', ['fdar_form_id' => $fdarForm->id]);

            // ✅ Update Common Diseases (Detach old ones, then attach new ones)
            $fdarForm->commonDiseases()->sync($validated['common_disease_ids'] ?? []);
            Log::info('Updated common diseases', [
                'fdar_form_id' => $fdarForm->id,
                'common_disease_ids' => $validated['common_disease_ids'] ?? []
            ]);

            // ✅ Update Custom Diseases
            DB::table('fdar_form_common_disease')
                ->where('fdar_form_id', $fdarForm->id)
                ->whereNotNull('custom_disease')
                ->delete(); // Remove old custom diseases

            if (!empty($validated['custom_diseases'])) {
                foreach ($validated['custom_diseases'] as $customDisease) {
                    DB::table('fdar_form_common_disease')->insert([
                        'fdar_form_id' => $fdarForm->id,
                        'custom_disease' => $customDisease,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                Log::info('Updated custom diseases', [
                    'fdar_form_id' => $fdarForm->id,
                    'custom_diseases' => $validated['custom_diseases']
                ]);
            }

            // Prepare for file handling
            $storageDir = storage_path('app/generated');
            $fdarFormId = $fdarForm->id;

            // Generate file names for the DOCX and PDF
            $createdAt = isset($fdarForm['created_at'])
                ? Carbon::parse($fdarForm['created_at'])->format('Ymd_His')
                : now()->format('Ymd_His');

            $patientName = isset($fdarForm['patient']['fname'], $fdarForm['patient']['lname'])
                ? trim("{$fdarForm['patient']['fname']}_{$fdarForm['patient']['lname']}")
                : 'unknown_student';

            $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters

            // Paths for DOCX and PDF
            $docxFilePath = "{$storageDir}/fdar_{$fdarFormId}_{$patientName}_{$createdAt}.docx";
            $pdfFilePath = "{$storageDir}/fdar_{$fdarFormId}_{$patientName}_{$createdAt}.pdf";

            // Check and delete old files if they exist
            if (File::exists($docxFilePath)) {
                File::delete($docxFilePath);
                Log::info("Deleted old DOCX file for FDAR form ID: {$fdarFormId}", ['file' => $docxFilePath]);
            }

            if (File::exists($pdfFilePath)) {
                File::delete($pdfFilePath);
                Log::info("Deleted old PDF file for FDAR form ID: {$fdarFormId}", ['file' => $pdfFilePath]);
            }

            // Regenerate the files if needed (optional)
            // This would depend on your use case for file regeneration

            Log::info('FDAR form updated successfully', ['fdar_form_id' => $id]);

            return redirect()->back()->with('success', 'FDAR form updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating FDAR form', [
                'fdar_form_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to update FDAR form. Please try again.');
        }
    }

    public function destroy($id)
    {
        Log::info('FDAR form delete request received', ['fdar_form_id' => $id]);

        try {
            // Ensure FDAR form exists
            $fdarForm = FDARForm::findOrFail($id);

            // Ensure user is authenticated
            if (!Auth::check()) {
                Log::warning('Unauthorized FDAR form delete attempt.');
                return back()->withErrors('Unauthorized action.');
            }

            // Delete related custom diseases
            DB::table('fdar_form_common_disease')->where('fdar_form_id', $fdarForm->id)->delete();
            Log::info('Deleted related custom diseases', ['fdar_form_id' => $fdarForm->id]);

            // Delete the FDAR form
            $fdarForm->delete();
            Log::info('FDAR form deleted', ['fdar_form_id' => $id]);

            return redirect()->back()->with('success', 'FDAR form deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting FDAR form', [
                'fdar_form_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors('Failed to delete FDAR form. Please try again.');
        }
    }

    public function viewPDF($id)
    {
        Log::info("Fetching FDAR form details for PDF generation", ['fdar_form_id' => $id]);

        $fdarForm = FDARForm::with([
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
                            'college_id'
                        )->with(['department', 'college']);
                    },
                    'nonpersonnel' => function ($q) {
                        $q->select(
                            'patient_id',
                            'affiliation'
                        );
                    }
                ]);
            },
            'recordedBy',
            'allDiseases' => function ($query) {
                $query->select(
                    'fdar_form_common_disease.fdar_form_id',
                    'fdar_form_common_disease.common_disease_id',
                    'fdar_form_common_disease.custom_disease',
                    DB::raw("COALESCE(common_diseases.name, fdar_form_common_disease.custom_disease) AS disease_name")
                )
                    ->leftJoin('common_diseases', 'fdar_form_common_disease.common_disease_id', '=', 'common_diseases.id');
            }
        ])->findOrFail($id);

        // Log the retrieved data for debugging
        Log::info("FDAR Form Data Retrieved", ['fdar_form' => $fdarForm->toArray()]);

        return FDARDocxService::generatePDF($fdarForm->toArray());
    }

    public function preview($id)
    {
        try {
            $fdarForm = FDARForm::findOrFail($id);
            return FDARDocxService::previewPDF($fdarForm);
        } catch (\Exception $e) {
            Log::error("Error previewing DOCX: " . $e->getMessage());
            return back()->withErrors('Failed to preview document.');
        }
    }
}
