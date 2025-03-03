<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'patient_id',
        'school_nurse_id',
        'school_physician_id',
        'recorded_by',
        'updated_by'
    ];

    /**
     * Relationship with Patient
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * Relationship with Clinic Staff (Nurse)
     */
    public function nurse()
    {
        return $this->belongsTo(ClinicStaff::class, 'school_nurse_id', 'staff_id');
    }

    /**
     * Relationship with Clinic Staff (Physician)
     */
    public function physician()
    {
        return $this->belongsTo(ClinicStaff::class, 'school_physician_id', 'staff_id');
    }

    /**
     * Relationship with Clinic Staff (Recorder)
     */
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    public function reviewOfSystems()
    {
        return $this->belongsToMany(ReviewOfSystem::class, 'medical_record_review_of_system')
            ->withPivot('custom_symptom')
            ->withTimestamps();
    }
}
