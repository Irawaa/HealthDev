<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\PreParticipatory;
use App\Models\PreParticipatoryVitalSign;
use App\Models\PastMedicalHistory;
use App\Models\PreParticipatoryInterview;
use App\Models\PhysicalExamination;

class PreParticipatoryController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Pre-Participatory record submission initiated', ['request' => $request->all()]);

        // Get the authenticated clinic staff (nurse or physician)
        $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;
        if (!$clinicStaffId) {
            Log::warning('Unauthorized clinic staff attempt.');
            return back()->withErrors('You are not authorized to submit a pre-participatory record.');
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'school_physician_id' => 'required|exists:clinic_staffs,staff_id',
                'final_evaluation' => 'required|integer|between:0,2', // 0: Fit, 1: Evaluation Needed, 2: Not Cleared
                'further_evaluation' => 'nullable|string|max:255',
                'not_cleared_for' => 'nullable|in:All sports,Certain sports,Activity',
                'activity_specification' => 'nullable|string|max:255',

                // ✅ Vital Signs Validation
                'bp' => 'required|string|max:10',
                'rr' => 'required|integer|min:0',
                'hr' => 'required|integer|min:0',
                'temperature' => 'required|numeric|min:30|max:45',
                'weight' => 'required|numeric|min:1|max:300',
                'height' => 'required|integer|min:50|max:500',

                // ✅ Past Medical Histories Validation
                'past_medical_histories' => 'array',
                'past_medical_histories.*' => 'string',
                'other_condition' => 'nullable|string',

                // ✅ Interview Responses Validation
                'interview_questions' => 'array',
                'interview_questions.*.response' => 'required|in:Yes,No',
                'interview_questions.*.remarks' => 'nullable|string|max:255',
                'interview_questions.*.question_id' => 'required|exists:pre_participatory_questions,id', // Ensure question_id exists

                // ✅ Physical Examination Validation
                'physical_examinations' => 'array',
                'physical_examinations.*.name' => 'required|string|exists:physical_examinations,name',
                'physical_examinations.*.result' => 'nullable|in:Normal,Abnormal',
                'physical_examinations.*.remarks' => 'nullable|string',
            ]);

            // Recorded by authenticated user
            $recordedBy = Auth::id();

            // Create the Pre-Participatory record
            $preParticipatory = PreParticipatory::create([
                'patient_id' => $validated['patient_id'],
                'school_nurse_id' => $clinicStaffId, // Assign authenticated nurse's ID
                'school_physician_id' => $validated['school_physician_id'],
                'final_evaluation' => $validated['final_evaluation'],
                'further_evaluation' => $validated['further_evaluation'],
                'not_cleared_for' => $validated['not_cleared_for'], // Add this line to store the value of not_cleared_for
                'activity_specification' => $validated['activity_specification'], // Ensure this is passed as well
                'recorded_by' => $recordedBy,
            ]);

            Log::info('Pre-Participatory record successfully created', ['pre_participatory' => $preParticipatory]);

            // Store Vital Signs
            $vitalSigns = PreParticipatoryVitalSign::create([
                'pre_participatory_id' => $preParticipatory->id,
                'bp' => $validated['bp'],
                'rr' => $validated['rr'],
                'hr' => $validated['hr'],
                'temperature' => $validated['temperature'],
                'weight' => $validated['weight'],
                'height' => $validated['height'],
            ]);

            Log::info('Vital signs successfully stored', ['vital_signs' => $vitalSigns]);

            // Handle Past Medical Histories
            if (!empty($validated['past_medical_histories'])) {
                Log::info('Handling Past Medical Histories', ['past_medical_histories' => $validated['past_medical_histories']]);

                $pastMedicalHistories = PastMedicalHistory::whereIn('condition_name', $validated['past_medical_histories'])->get();
                Log::info('Fetched Past Medical Histories from database', ['past_medical_histories' => $pastMedicalHistories->toArray()]);

                $pastHistorySyncData = [];
                foreach ($pastMedicalHistories as $history) {
                    $pastHistorySyncData[$history->id] = ['custom_condition' => null];
                }

                if (!empty($validated['other_condition'])) {
                    Log::info('Adding custom condition to Past Medical History', ['other_condition' => $validated['other_condition']]);

                    // Handle the 'Other' condition with custom text
                    $customHistory = PastMedicalHistory::firstOrCreate(['condition_name' => 'Others']);
                    $pastHistorySyncData[$customHistory->id] = ['custom_condition' => $validated['other_condition']];
                }

                // Sync the selected past medical histories with the PreParticipatory record
                $preParticipatory->pastMedicalHistories()->sync($pastHistorySyncData);

                Log::info('Past Medical Histories synced with PreParticipatory record', ['past_history_sync_data' => $pastHistorySyncData]);
            } else {
                Log::info('No past medical histories provided in the request.');
            }

            // ✅ Sync Interview Responses
            if (!empty($validated['interview_questions'])) {
                Log::info('Syncing Interview Responses', ['interview_questions' => $validated['interview_questions']]);

                foreach ($validated['interview_questions'] as $interviewData) {
                    PreParticipatoryInterview::updateOrCreate(
                        [
                            'pre_participatory_id' => $preParticipatory->id,
                            'question_id' => $interviewData['question_id']
                        ],
                        [
                            'response' => $interviewData['response'],
                            'remarks' => $interviewData['remarks'] ?? null
                        ]
                    );
                }

                Log::info('Interview responses successfully stored or updated.');
            } else {
                Log::info('No interview responses provided in the request.');
            }

            // ✅ Sync Physical Examinations
            if (!empty($validated['physical_examinations'])) {
                Log::info('Syncing Physical Examinations', ['physical_examinations' => $validated['physical_examinations']]);

                $syncData = [];
                foreach ($validated['physical_examinations'] as $exam) {
                    $physicalExam = PhysicalExamination::where('name', $exam['name'])->first();

                    if ($physicalExam) {
                        $syncData[$physicalExam->id] = [
                            'result' => $exam['result'] ?? 'Normal', // Default Normal
                            'remarks' => $exam['remarks'] ?? null,
                        ];
                    }
                }

                Log::info('Physical examinations sync data', ['sync_data' => $syncData]);

                // Sync the physical examinations with the PreParticipatory record
                $preParticipatory->physicalExaminations()->sync($syncData);

                Log::info('Physical examinations successfully synced.');
            } else {
                Log::info('No physical examinations provided in the request.');
            }

            return redirect()->back()->with('success', 'Pre-Participatory record created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing pre-participatory record', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors('Failed to create pre-participatory record. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Log::info("Deleting Pre-Participatory record with ID: {$id}");

        try {
            // Find the PreParticipatory record
            $preParticipatory = PreParticipatory::findOrFail($id);

            // Delete related records
            PreParticipatoryVitalSign::where('pre_participatory_id', $id)->delete();
            PreParticipatoryInterview::where('pre_participatory_id', $id)->delete();

            // Detach relationships
            $preParticipatory->pastMedicalHistories()->detach();
            $preParticipatory->physicalExaminations()->detach();

            // Delete the main record
            $preParticipatory->delete();

            Log::info("Pre-Participatory record with ID: {$id} successfully deleted.");

            return redirect()->back()->with('success', 'Pre-Participatory record deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting Pre-Participatory record", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->withErrors('Failed to delete Pre-Participatory record.');
        }
    }
}
