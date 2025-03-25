public function show(Patient $patient)
    {
        $requestedData = request()->input('requestedData', []);
        $patientType = $this->determinePatientType($patient);

        $relations = [];

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

        if (in_array('medicalRecords', $requestedData)) {
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
                'medicalRecordDetail',
            ])->latest();
        }

        if (in_array('dentalRecords', $requestedData)) {
            $relations['dentalRecords'] = fn($query) => $query->select(
                'id',
                'patient_id',
                'school_dentist_id',
                'school_nurse_id',
                'dental_record_chart',  // No need to use DB::raw here
                'gingival_status',
                'periodontitis_severity',
                'plaque_deposit',
                'other_treatments',
                'recommended_treatment',
                'recorded_by',
                'updated_by',
                'created_at'
            )->with([
                'dentist:staff_id,fname,lname,mname', // Load dentist details
                'nurse:staff_id,fname,lname,mname',   // Load nurse details
            ])->latest();
        }

        if (in_array('bpForms', $requestedData)) {
            $relations['bpForms'] = fn($query) => $query->with(['readings'])->latest();
        }

        if (in_array('fdarForms', $requestedData)) {
            $relations['fdarForms'] = fn($query) => $query->with([
                'allDiseases' => function ($query) {
                    $query->select(
                        'fdar_form_common_disease.fdar_form_id',
                        'fdar_form_common_disease.common_disease_id',
                        'fdar_form_common_disease.custom_disease',
                        'common_diseases.name as disease_name'
                    )
                        ->leftJoin('common_diseases', 'fdar_form_common_disease.common_disease_id', '=', 'common_diseases.id');
                }
            ])->latest();
        }

        if (in_array('incidentReports', $requestedData)) {
            $relations['incidentReports'] = fn($query) =>  $query->with([
                'schoolNurse',
                'schoolPhysician',
                'recordedBy',
                'updatedBy'
            ])->latest();
        }

        if (in_array('prescriptions', $requestedData)) {
            $relations['prescriptions'] = fn($query) => $query->select(
                'patient_id',
                'prescription_number',
            )->latest();
        }

        if (in_array('medicalCertificates', $requestedData)) {
            $relations['medicalCertificates'] = fn($query) => $query->with([
                'schoolPhysician:staff_id,fname,lname,mname,license_no', // ✅ Fix staff_id reference
                'schoolNurse:staff_id,fname,lname,mname', // ✅ Load Nurse Details
            ])->latest();
        }

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

        $commonDiseases = CommonDisease::orderBy('name')
            ->select('id', 'name')
            ->get();

        $physicianStaff = ClinicStaff::whereIn('role', ['University Physician', 'Clinic Physician'])
            ->orderBy('lname')
            ->select('staff_id', 'lname', 'fname', 'mname', 'ext', 'license_no', 'ptr_no')
            ->get();

        return Inertia::render('Patients/ProfilePage', [
            'patient' => $patient,
            'requestedData' => $requestedData,
        'patientType' => $patientType,
            'colleges' => $colleges,
            'departments' => $departments,
            'commonDiseases' => $commonDiseases,
            'physicianStaff' => $physicianStaff
        ]);
    }