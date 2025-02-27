<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\College;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::with([
            'student' => function ($query) {
                $query->select(
                    'patient_id',
                    'stud_id',
                    'address_house',
                    'address_brgy',
                    'address_citytown',
                    'address_province',
                    'address_zipcode',
                    'program_id',
                    'college_id'
                );
            },

            'personnel' => function ($query) {
                $query->select(
                    'patient_id',
                    'employee_id',
                    'res_brgy', 
                    'res_city', 
                    'res_prov',
                    'res_region', 
                    'res_zipcode',
                    'dept_id',
                    'college_id',
                );
            }
        ])->latest()->get();

        $colleges = College::where('is_active', 1)
            ->orderBy('college_id')
            ->select('college_id', 'description as college_description', 'college_code')
            ->distinct() // Ensure unique college_id
            ->with(['programs' => function ($query) {
                $query->where('is_active', 1)
                    ->orderBy('program_id')
                    ->select('program_id', 'college_id', 'description as program_description', 'program_code', 'section_code', 'type');
            }])
            ->get();

        $departments = Department::select('dept_id', 'name', 'acronym')->get();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'colleges' => $colleges,
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:student,employee,non_personnel',
            'lname' => 'nullable|string|max:100',
            'fname' => 'nullable|string|max:100',
            'mname' => 'nullable|string|max:100',
            'ext' => 'nullable|string|max:10',
            'birthdate' => 'nullable|date',
            'gender' => 'required|boolean',
            'civil_status' => 'nullable|boolean',
            'email' => 'nullable|email|max:200',
            'mobile' => 'nullable|string|max:50',
            'telephone' => 'nullable|string|max:50',
            'updated_by' => 'nullable|integer|exists:users,user_id'
        ]);

        Patient::create($validated);
        return redirect()->route('patients.index')->with('success', 'Patient added successfully.');
    }

    public function show(Patient $patient)
    {
        return Inertia::render('Patients/Profile', [
            'patient' => $patient
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'type' => 'required|in:student,employee,non_personnel',
            'lname' => 'nullable|string|max:100',
            'fname' => 'nullable|string|max:100',
            'mname' => 'nullable|string|max:100',
            'ext' => 'nullable|string|max:10',
            'birthdate' => 'nullable|date',
            'gender' => 'required|boolean',
            'civil_status' => 'nullable|boolean',
            'email' => 'nullable|email|max:200',
            'mobile' => 'nullable|string|max:50',
            'telephone' => 'nullable|string|max:50',
            'updated_by' => 'nullable|integer|exists:users,user_id'
        ]);

        $patient->update($validated);
        return redirect()->route('patients.index')->with('success', 'Patient updated successfully.');
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return redirect()->route('patients.index')->with('success', 'Patient deleted successfully.');
    }
}
