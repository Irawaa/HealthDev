<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    public function store(Request $request)
    {
        // Validate Request
        $validated = $request->validate([
            // Patients Table
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

            // Employees Table
            'employee_no' => 'required|string|max:255|unique:employees,employee_no',
            'date_hired' => 'required|date',
            'is_active' => ['required', Rule::in(['1', '0'])], // 1 = Active, 0 = Inactive
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'blood_type' => 'nullable|string|max:5',
            'father_name' => 'nullable|string|max:200',
            'mother_name' => 'nullable|string|max:200',
            'spouse_name' => 'nullable|string|max:200',
            'spouse_occupation' => 'nullable|string|max:100',
            'emergency_contact_person' => 'nullable|string|max:200',
            'emergency_contact_number' => 'nullable|string|max:20',
            'res_brgy' => 'nullable|string|max:45',
            'res_city' => 'nullable|string|max:45',
            'res_prov' => 'nullable|string|max:45',
            'res_region' => 'nullable|integer',
            'res_zipcode' => 'nullable|string|max:10',
            'dept_id' => 'nullable|exists:departments,dept_id',
            'college_id' => 'nullable|exists:colleges,college_id',
        ]);

        // Start Transaction
        DB::beginTransaction();

        try {
            // Create Patient
            $patient = Patient::create([
                'type' => 'employee',
                'lname' => $validated['lname'],
                'fname' => $validated['fname'],
                'mname' => $validated['mname'] ?? null,
                'ext' => $validated['ext'] ?? null,
                'birthdate' => $validated['birthdate'],
                'gender' => (bool)$validated['gender'],
                'civil_status' => (bool)$validated['civil_status'],
                'email' => $validated['email'] ?? null,
                'mobile' => $validated['mobile'],
                'telephone' => $validated['telephone'] ?? null,
                'updated_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$patient || !$patient->patient_id) {
                DB::rollBack();
                Log::error('Failed to create Patient');
                return redirect()->back()->with('error', 'Failed to create patient. Please try again.');
            }

            Log::info('Patient created with ID: ' . $patient->patient_id);

            // Create Employee
            $employee = Employee::create([
                'patient_id' => $patient->patient_id,
                'employee_no' => $validated['employee_no'],
                'date_hired' => $validated['date_hired'],
                'is_active' => (bool)$validated['is_active'],
                'height' => $validated['height'] ?? null,
                'weight' => $validated['weight'] ?? null,
                'blood_type' => $validated['blood_type'] ?? null,
                'father_name' => $validated['father_name'] ?? null,
                'mother_name' => $validated['mother_name'] ?? null,
                'spouse_name' => $validated['spouse_name'] ?? null,
                'spouse_occupation' => $validated['spouse_occupation'] ?? null,
                'emergency_contact_person' => $validated['emergency_contact_person'] ?? null,
                'emergency_contact_number' => $validated['emergency_contact_number'] ?? null,
                'res_brgy' => $validated['res_brgy'] ?? null,
                'res_city' => $validated['res_city'] ?? null,
                'res_prov' => $validated['res_prov'] ?? null,
                'res_region' => $validated['res_region'] ?? null,
                'res_zipcode' => $validated['res_zipcode'] ?? null,
                'dept_id' => $validated['dept_id'] ?? null,
                'college_id' => $validated['college_id'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$employee || !$employee->employee_id) {
                DB::rollBack();
                Log::error('Failed to create Employee for Patient ID: ' . $patient->patient_id);
                return redirect()->back()->with('error', 'Failed to create employee. Please try again.');
            }

            Log::info('Employee created with ID: ' . $employee->employee_id);

            DB::commit();

            return redirect()->back()->with('success', 'Employee added successfully');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error storing employee: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'An unexpected error occurred. Please contact support.');
        }
    }
}
