<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Patient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class StudentController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            // Patients Table Fields
            'lname' => 'required|string|max:100',
            'fname' => 'required|string|max:100',
            'mname' => 'nullable|string|max:100',
            'ext' => 'nullable|string|max:10',
            'birthdate' => 'required|date',
            'gender' => ['required', Rule::in(['1', '0'])], // 1 = Male, 0 = Female
            'civil_status' => ['required', Rule::in(['1', '0'])], // 1 = Married, 0 = Single
            'email' => 'nullable|email|max:200|unique:patients,email',
            'mobile' => 'required|string|max:50',
            'telephone' => 'nullable|string|max:50',

            // Students Table Fields
            'stud_id' => 'required|string|max:10|unique:students,stud_id',
            'is_vaccinated' => ['required', Rule::in(['1', '0'])], // 1 = Yes, 0 = No
            'college_id' => 'nullable|integer',
            'program_id' => 'nullable|integer',
            'father_name' => 'required|string|max:200',
            'father_birthdate' => 'nullable|date',
            'father_occupation' => 'required|string|max:255',
            'mother_name' => 'required|string|max:200',
            'mother_birthdate' => 'nullable|date',
            'mother_occupation' => 'required|string|max:255',
            'guardian_name' => 'required|string|max:200',
            'guardian_relation' => 'required|string|max:50',
            'guardian_contactno' => 'required|string|max:20',
            'address_house' => 'nullable|string',
            'address_brgy' => 'nullable|string|max:100',
            'address_citytown' => 'nullable|string|max:100',
            'address_province' => 'nullable|string|max:100',
            'address_zipcode' => 'nullable|integer',
            'emergency_contact_name' => 'nullable|string|max:200',
            'emergency_contact_no' => 'nullable|string|max:20',
        ]);

        // Log the validated input
        Log::info('Validated Data:', $validated);

        // Start transaction to ensure atomic operations
        DB::beginTransaction();

        try {
            // Create a Patient entry first
            $patient = Patient::create([
                'type' => 'student',
                'lname' => $validated['lname'],
                'fname' => $validated['fname'],
                'mname' => $validated['mname'] ?? null,
                'ext' => $validated['ext'] ?? null,
                'birthdate' => $validated['birthdate'],
                'gender' => (bool) $validated['gender'], // Convert to boolean
                'civil_status' => (bool) $validated['civil_status'], // Convert to boolean
                'email' => $validated['email'] ?? null,
                'mobile' => $validated['mobile'],
                'telephone' => $validated['telephone'] ?? null,
                'updated_by' => Auth::id() ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Ensure the patient was created
            if (!$patient || !$patient->patient_id) {
                DB::rollBack();
                Log::error('Failed to create patient');
                return redirect()->back()->with('error', 'Failed to create patient. Please try again.');
            }

            Log::info('Patient created with ID: ' . $patient->patient_id);

            // Create a Student entry linked to the Patient
            $student = Student::create([
                'patient_id' => $patient->patient_id,
                'stud_id' => $validated['stud_id'],
                'is_vaccinated' => (bool) $validated['is_vaccinated'], // Convert to boolean
                'college_id' => $validated['college_id'] ?? null,
                'program_id' => $validated['program_id'] ?? null,
                'father_name' => $validated['father_name'],
                'father_birthdate' => $validated['father_birthdate'] ?? null,
                'father_occupation' => $validated['father_occupation'],
                'mother_name' => $validated['mother_name'],
                'mother_birthdate' => $validated['mother_birthdate'] ?? null,
                'mother_occupation' => $validated['mother_occupation'],
                'guardian_name' => $validated['guardian_name'],
                'guardian_relation' => $validated['guardian_relation'],
                'guardian_contactno' => $validated['guardian_contactno'],
                'address_house' => $validated['address_house'] ?? null,
                'address_brgy' => $validated['address_brgy'] ?? null,
                'address_citytown' => $validated['address_citytown'] ?? null,
                'address_province' => $validated['address_province'] ?? null,
                'address_zipcode' => $validated['address_zipcode'] ?? null,
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_no' => $validated['emergency_contact_no'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Ensure the student was created
            if (!$student || !$student->stud_id) {
                DB::rollBack();
                Log::error('Failed to create student for patient ID: ' . $patient->patient_id);
                return redirect()->back()->with('error', 'Failed to create student. Please try again.');
            }

            Log::info('Student created with ID: ' . $student->stud_id);

            // Commit transaction if everything is successful
            DB::commit();
            return redirect()->back()->with('success', 'Student added successfully');

        } catch (\Throwable $e) { // Catch any type of error
            DB::rollBack();
            Log::error('Error storing student: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'An unexpected error occurred. Please contact support.');
        }
    }
}
