<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\College;
use App\Models\Department;
use App\Models\CommonDisease;
use App\Models\ClinicStaff;
use App\Models\PreParticipatoryQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $typeFilter = $request->input('type', []);
        $medicalStatusFilter = $request->input('medicalStatus', []);

        // Query patients only if a search term is provided
        $patientsQuery = Patient::select('patient_id', 'type', 'lname', 'fname', 'mname', 'gender', 'mobile', 'telephone', 'status')
            ->with([
                'student:patient_id,stud_id,college_id,program_id',
                'personnel:patient_id,employee_id,dept_id,college_id',
                'nonpersonnel:patient_id,affiliation',
            ]);

        // Apply search filters if search is provided
        if (!empty($search)) {
            $patientsQuery->where(function ($query) use ($search) {
                $query->where('lname', 'LIKE', "%$search%")
                    ->orWhere('fname', 'LIKE', "%$search%")
                    ->orWhere('mname', 'LIKE', "%$search%")
                    ->orWhere('type', 'LIKE', "%$search%")
                    ->orWhereHas('student', function ($query) use ($search) {
                        $query->where('stud_id', 'LIKE', "%$search%");
                    })
                    ->orWhereHas('personnel', function ($query) use ($search) {
                        $query->where('employee_id', 'LIKE', "%$search%");
                    })
                    ->orWhereHas('nonpersonnel', function ($query) use ($search) {
                        $query->where('affiliation', 'LIKE', "%$search%");
                    });
            });
        }

        // Apply filters
        if (!empty($typeFilter)) {
            $patientsQuery->whereIn('type', $typeFilter);
        }

        if (!empty($medicalStatusFilter)) {
            $patientsQuery->whereIn('status', $medicalStatusFilter);
        }

        $patients = !empty($search) ? $patientsQuery->latest()->get() : [];

        // Fetch only necessary supporting data
        $colleges = College::where('is_active', 1)
            ->orderBy('college_id')
            ->select('college_id', 'description as college_description')
            ->with([
                'programs' => function ($query) {
                    $query->where('is_active', 1)
                        ->orderBy('program_id')
                        ->select('program_id', 'college_id', 'description as program_description');
                }
            ])
            ->get();

        $departments = Department::select('dept_id', 'name')->get();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'search' => $search,
            'colleges' => $colleges,
            'departments' => $departments
        ]);
    }

    private function determinePatientType(Patient $patient)
    {
        if ($patient->student()->exists()) {
            return 'student';
        } elseif ($patient->personnel()->exists()) {
            return 'personnel';
        } elseif ($patient->nonpersonnel()->exists()) {
            return 'nonpersonnel';
        }

        return null; // If no type is found
    }


    public function show(Request $request, Patient $patient)
    {
        $activeTab = $request->query('activeTab', 'medical');
        // Determine patient type
        $patientType = $this->determinePatientType($patient);

        // Initialize relations array
        $relations = [];

        // Load only the necessary role based on the determined type
        if ($patientType === 'student') {
            $relations['student'] = fn($query) => $query->select(
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
        } elseif ($patientType === 'personnel') {
            $relations['personnel'] = fn($query) => $query->select(
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
        } elseif ($patientType === 'nonpersonnel') {
            $relations['nonpersonnel'] = fn($query) => $query->select(
                'patient_id',
                'affiliation',
                'res_brgy',
                'res_city',
                'res_prov',
                'res_region',
                'res_zipcode'
            );
        }

        // Dynamically load data based on activeTab
        switch ($activeTab) {
            case 'medical':
                $relations['medicalRecords'] = fn($query) => $query->select(
                    'id',
                    'patient_id',
                    'school_nurse_id',
                    'school_physician_id',
                    'recorded_by',
                    'updated_by',
                    'final_evaluation',
                    'plan_recommendation',
                    'created_at'
                )->with([
                            'reviewOfSystems',
                            'deformities',
                            'vitalSigns',
                            'pastMedicalHistories',
                            'obGyneHistory',
                            'personalSocialHistory',
                            'familyHistories',
                            'physicalExaminations',
                            'medicalRecordDetail'
                        ])->latest();
                break;

            case 'dental':
                $relations['dentalRecords'] = fn($query) => $query->select(
                    'id',
                    'patient_id',
                    'school_dentist_id',
                    'school_nurse_id',
                    'dental_record_chart',
                    'gingival_status',
                    'periodontitis_severity',
                    'plaque_deposit',
                    'other_treatments',
                    'recommended_treatment',
                    'recorded_by',
                    'updated_by',
                    'created_at'
                )->with([
                            'dentist:staff_id,fname,lname,mname',
                            'nurse:staff_id,fname,lname,mname'
                        ])->latest();
                break;

            case 'fdar':
                $relations['fdarForms'] = fn($query) => $query->with([
                    'allDiseases' => fn($query) => $query->select(
                        'fdar_form_common_disease.fdar_form_id',
                        'fdar_form_common_disease.common_disease_id',
                        'fdar_form_common_disease.custom_disease',
                        'common_diseases.name as disease_name'
                    )->leftJoin('common_diseases', 'fdar_form_common_disease.common_disease_id', '=', 'common_diseases.id')
                ])->latest();
                break;

            case 'bp':
                $relations['bpForms'] = fn($query) => $query->with(['readings'])->latest();
                break;

            case 'incident':
                $relations['incidentReports'] = fn($query) => $query->with([
                    'schoolNurse',
                    'schoolPhysician',
                    'recordedBy',
                    'updatedBy'
                ])->latest();
                break;

            case 'prescription':
                $relations['prescriptions'] = fn($query) => $query->select(
                    'patient_id',
                    'prescription_number'
                )->latest();
                break;

            case 'certificates':
                $relations['medicalCertificates'] = fn($query) => $query->with([
                    'schoolPhysician:staff_id,fname,lname,mname,license_no',
                    'schoolNurse:staff_id,fname,lname,mname'
                ])->latest();
                $relations['dentalCertificates'] = fn($query) => $query->with([
                    'schoolDentist:staff_id,fname,lname,mname,license_no',
                    'schoolNurse:staff_id,fname,lname,mname'
                ])->latest();
                break;

            case 'referrals':
                $relations['laboratoryExamReferrals'] = fn($query) => $query->with([
                    'schoolPhysician:staff_id,fname,lname,mname,license_no',
                    'schoolNurse:staff_id,fname,lname,mname'
                ])->latest();
                $relations['generalReferrals'] = fn($query) => $query->with([
                    'schoolPhysician:staff_id,fname,lname,mname,license_no',
                    'schoolNurse:staff_id,fname,lname,mname'
                ])->latest();
                break;

            case 'pre-participatory':
                $relations['preParticipatories'] = fn($query) => $query->select(
                    'id',
                    'patient_id',
                    'school_nurse_id',
                    'school_physician_id',
                    'recorded_by',
                    'updated_by',
                    'final_evaluation',
                    'further_evaluation',
                    'not_cleared_for',
                    'activity_specification',
                    'created_at'
                )->with([
                            'patient:patient_id,fname,lname,mname',
                            'nurse:staff_id,fname,lname,mname',
                            'physician:staff_id,fname,lname,mname,license_no',
                            'pastMedicalHistories',
                            'vitalSigns',
                            'physicalExaminations',
                            'interview' => function ($query) {
                                $query->select('id', 'pre_participatory_id', 'question_id', 'response', 'remarks')
                                    ->with('question:id,question'); // Include any related data for the questions
                            }
                        ])->latest();
                break;
        }

        // Load patient data with determined relations
        $patient->load($relations);

        // Fetch supporting data
        $colleges = College::where('is_active', 1)
            ->orderBy('college_id')
            ->select('college_id', 'description as college_description', 'college_code')
            ->distinct()
            ->with([
                'programs' => function ($query) {
                    $query->where('is_active', 1)
                        ->orderBy('program_id')
                        ->select('program_id', 'college_id', 'description as program_description', 'program_code', 'section_code', 'type');
                }
            ])
            ->get();

        $departments = Department::select('dept_id', 'name', 'acronym')->get();

        $interviewQuestions = PreParticipatoryQuestion::select('id', 'question')->get();

        $commonDiseases = CommonDisease::orderBy('name')
            ->select('id', 'name')
            ->get();

        $physicianStaff = ClinicStaff::whereIn('role', ['University Physician', 'Clinic Physician'])
            ->orderBy('lname')
            ->select('staff_id', 'lname', 'fname', 'mname', 'ext', 'license_no', 'ptr_no')
            ->get();

        $dentistStaff = ClinicStaff::whereIn('role', ['Clinic Dentist'])
            ->orderBy('lname')
            ->select('staff_id', 'lname', 'fname', 'mname', 'ext', 'license_no', 'ptr_no')
            ->get();

        return Inertia::render('Patients/ProfilePage', [
            'patient' => $patient,
            'colleges' => $colleges,
            'departments' => $departments,
            'commonDiseases' => $commonDiseases,
            'physicianStaff' => $physicianStaff,
            'dentistStaff' => $dentistStaff,
            'activeTab' => $activeTab,
            'interviewQuestions' => $interviewQuestions,
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
