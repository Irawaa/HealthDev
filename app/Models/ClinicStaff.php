<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicStaff extends Model
{
    use HasFactory;

    protected $table = 'clinic_staffs';
    protected $primaryKey = 'staff_id';
    public $timestamps = true;

    protected $fillable = [
        'lname',
        'fname',
        'mname',
        'ext',
        'role',
        'license_no',
        'ptr_no',
        'email',
        'contact_no'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'staff_id', 'staff_id');
    }

    // Medical Record

    public function medicalRecordsAsNurse()
    {
        return $this->hasMany(MedicalRecord::class, 'school_nurse_id', 'staff_id');
    }

    public function medicalRecordsAsPhysician()
    {
        return $this->hasMany(MedicalRecord::class, 'school_physician_id', 'staff_id');
    }

    // Dental Record

    public function dentalRecordsAsDentist()
    {
        return $this->hasMany(DentalRecord::class, 'school_dentist_id', 'staff_id');
    }

    public function dentalRecordsAsNurse()
    {
        return $this->hasMany(DentalRecord::class, 'school_nurse_id', 'staff_id');
    }

    // BP Monitoring

    public function bpFormsAsNurse()
    {
        return $this->hasMany(BPForm::class, 'school_nurse_id', 'staff_id');
    }

    public function bpFormsAsPhysician()
    {
        return $this->hasMany(BPForm::class, 'school_physician_id', 'staff_id');
    }


    // FDAR Forms

    public function fdarFormsAsNurse()
    {
        return $this->hasMany(FDARForm::class, 'school_nurse_id', 'staff_id');
    }

    public function fdarFormsAsRecorder()
    {
        return $this->hasMany(FDARForm::class, 'recorded_by', 'staff_id');
    }

    // Incident Reports:

    public function incidentReportsAsNurse()
    {
        return $this->hasMany(IncidentReport::class, 'school_nurse_id', 'staff_id');
    }

    public function incidentReportsAsPhysician()
    {
        return $this->hasMany(IncidentReport::class, 'school_physician_id', 'staff_id');
    }

    // Medical Certificate

    public function medicalCertificatesAsNurse()
    {
        return $this->hasMany(MedicalCertificate::class, 'school_nurse_id', 'staff_id');
    }

    public function medicalCertificatesAsPhysician()
    {
        return $this->hasMany(MedicalCertificate::class, 'school_physician_id', 'staff_id');
    }

    // Dental Certificate

    public function dentalCertificatesAsNurse()
    {
        return $this->hasMany(DentalCertificate::class, 'school_nurse_id', 'staff_id');
    }

    public function dentalCertificatesAsDentist()
    {
        return $this->hasMany(DentalCertificate::class, 'school_dentist_id', 'staff_id');
    }

    // Prescription

    public function prescriptionsAsNurse()
    {
        return $this->hasMany(Prescription::class, 'school_nurse_id', 'staff_id');
    }

    public function prescriptionsAsPhysician()
    {
        return $this->hasMany(Prescription::class, 'school_physician_id', 'staff_id');
    }

    // Pre-participatory

    public function preParticipatoriesAsNurse()
    {
        return $this->hasMany(PreParticipatory::class, 'school_nurse_id', 'staff_id');
    }

    public function preParticipatoriesAsPhysician()
    {
        return $this->hasMany(PreParticipatory::class, 'school_physician_id', 'staff_id');
    }

    // General Referral (Referral)

    public function generalReferralsAsNurse()
    {
        return $this->hasMany(GeneralReferral::class, 'school_nurse_id', 'staff_id');
    }

    public function generalReferralsAsPhysician()
    {
        return $this->hasMany(GeneralReferral::class, 'school_physician_id', 'staff_id');
    }

    // Laborartory Exam Referral 

    public function laboratoryExamReferralsAsNurse()
    {
        return $this->hasMany(LaboratoryExamReferral::class, 'school_nurse_id', 'staff_id');
    }

    public function laboratoryExamReferralsAsPhysician()
    {
        return $this->hasMany(LaboratoryExamReferral::class, 'school_physician_id', 'staff_id');
    }
}
