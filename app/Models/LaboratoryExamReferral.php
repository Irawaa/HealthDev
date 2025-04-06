<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryExamReferral extends Model
{
    use HasFactory;

    protected $table = 'laboratory_exam_referrals';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'x_ray',
        'cbc',
        'urinalysis',
        'fecalysis',
        'physical_examination',
        'dental',
        'hepatitis_b_screening',
        'pregnancy_test',
        'drug_test',
        'magic_8',
        'fbs',
        'lipid_profile',
        'bun',
        'bua',
        'creatine',
        'sgpt',
        'sgot',
        'others',
        'school_nurse_id',
        'school_physician_id',
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

    // 📌 Relationship with School Physician (Clinic Staff)
    public function schoolPhysician()
    {
        return $this->belongsTo(ClinicStaff::class, 'school_physician_id', 'staff_id');
    }

    // 📌 Relationship with User who recorded the referral
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    // 📌 Relationship with User who last updated the referral
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
