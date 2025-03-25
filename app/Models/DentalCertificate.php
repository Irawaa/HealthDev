<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DentalCertificate extends Model
{
    use HasFactory;

    protected $table = 'dental_certificates';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'mouth_examination',
        'gum_treatment',
        'oral_prophylaxis',
        'extraction',
        'remarks',
        'school_nurse_id',
        'school_dentist_id',
        'recorded_by',
        'updated_by',
    ];

    /**
     * Define relationships.
     */

    // 📌 Relationship with Patient
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    // 📌 Relationship with School Nurse (Clinic Staff)
    public function schoolNurse()
    {
        return $this->belongsTo(ClinicStaff::class, 'school_nurse_id', 'staff_id');
    }

    // 📌 Relationship with School Dentist (Clinic Staff)
    public function schoolDentist()
    {
        return $this->belongsTo(ClinicStaff::class, 'school_dentist_id', 'staff_id');
    }

    // 📌 Relationship with User who recorded the certificate
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    // 📌 Relationship with User who last updated the certificate
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
