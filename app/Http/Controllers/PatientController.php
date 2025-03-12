<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\College;
use App\Models\Department;
use App\Models\CommonDisease;
use App\Models\ClinicStaff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Query patients only if search is provided
        $patientsQuery = Patient::with([
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
                    'college_id'
                );
            },

            'nonpersonnel' => function ($query) {
                $query->select(
                    'patient_id',
                    'affiliation',
                    'res_brgy',
                    'res_city',
                    'res_prov',
                    'res_region',
                    'res_zipcode'
                );
            },

            // Load medical records for each patient
            'medicalRecords' => function ($query) {
                $query->with([
                    'reviewOfSystems',
                    'deformities',
                    'vitalSigns',
                    'pastMedicalHistories',
                    'obGyneHistory',
                    'personalSocialHistory',
                    'familyHistories',
                    'physicalExaminations',
                    'medicalRecordDetail',
                ]);
            },

            'bpForms' => function ($query) {
                $query->with(['readings'])->latest();
            },

            'fdarForms' => function ($query) {
                $query->with(['commonDiseases'])->latest();
            },

            'incidentReports' => function ($query) {
                $query->with([
                    'schoolNurse',
                    'schoolPhysician',
                    'recordedBy',
                    'updatedBy'
                ])->latest();
            },
        ]);

        if (!empty($search)) {
            $patientsQuery->where(function ($query) use ($search) {
                $query->where('lname', 'LIKE', "%{$search}%")
                    ->orWhere('fname', 'LIKE', "%{$search}%")
                    ->orWhere('mname', 'LIKE', "%{$search}%")
                    ->orWhere('type', 'LIKE', "%{$search}%");
            });
        }

        // Fetch patients only if searching; otherwise, keep empty
        $patients = !empty($search) ? $patientsQuery->latest()->get() : [];

        // Fetch supporting data
        $colleges = College::where('is_active', 1)
            ->orderBy('college_id')
            ->select('college_id', 'description as college_description', 'college_code')
            ->distinct()
            ->with(['programs' => function ($query) {
                $query->where('is_active', 1)
                    ->orderBy('program_id')
                    ->select('program_id', 'college_id', 'description as program_description', 'program_code', 'section_code', 'type');
            }])
            ->get();

        $departments = Department::select('dept_id', 'name', 'acronym')->get();

        $commonDiseases = CommonDisease::orderBy('name')
            ->select('id', 'name')
            ->get();

        $physicianStaff = ClinicStaff::whereIn('role', ['University Physician', 'Clinic Physician'])
            ->orderBy('lname')
            ->select('staff_id', 'lname', 'fname', 'mname', 'ext', 'license_no', 'ptr_no')
            ->get();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'search' => $search, // Preserve search input in frontend
            'colleges' => $colleges,
            'departments' => $departments,
            'commonDiseases' => $commonDiseases,
            'physicianStaff' => $physicianStaff
        ]);
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
