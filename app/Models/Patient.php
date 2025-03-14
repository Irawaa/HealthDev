<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients'; // Explicitly define table name

    protected $primaryKey = 'patient_id'; // Set custom primary key

    protected $fillable = [
        'type',
        'lname',
        'fname',
        'mname',
        'ext',
        'birthdate',
        'gender',
        'civil_status',
        'email',
        'mobile',
        'telephone',
        'status',
        'updated_by',
    ];

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id')->withDefault();
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'patient_id', 'patient_id');
    }

    public function personnel()
    {
        return $this->hasOne(Employee::class, 'patient_id', 'patient_id');
    }

    public function nonpersonnel()
    {
        return $this->hasOne(NonPersonnel::class, 'patient_id', 'patient_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'patient_id', 'patient_id');
    }

    public function bpForms()
    {
        return $this->hasMany(BPForm::class, 'patient_id', 'patient_id');
    }

    public function fdarForms()
    {
        return $this->hasMany(FDARForm::class, 'patient_id', 'patient_id');
    }

    public function incidentReports()
    {
        return $this->hasMany(IncidentReport::class, 'patient_id', 'patient_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'patient_id', 'patient_id');
    }
}
