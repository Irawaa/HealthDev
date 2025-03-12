<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'patient_id',
        'school_nurse_id',
        'school_physician_id',
        'recorded_by',
        'updated_by',
        'final_evaluation',
        'plan_recommendation',
    ];

    /**
     * Relationship with Patient
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * Relationship with Clinic Staff (Nurse)
     */
    public function nurse(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_nurse_id', 'staff_id');
    }

    /**
     * Relationship with Clinic Staff (Physician)
     */
    public function physician(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_physician_id', 'staff_id');
    }

    /**
     * Relationship with Clinic Staff (Recorder)
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    /**
     * Relationship with Review of Systems
     */
    public function reviewOfSystems(): BelongsToMany
    {
        return $this->belongsToMany(ReviewOfSystem::class, 'medical_record_review_of_system')
            ->withPivot('custom_symptom')
            ->withTimestamps();
    }

    /**
     * Relationship with Deformities
     */
    public function deformities(): BelongsToMany
    {
        return $this->belongsToMany(Deformity::class, 'medical_record_deformities', 'medical_record_id', 'deformity_id')
            ->withTimestamps();
    }

    /**
     * Relationship with MedicalRecordVitalSign (One-to-One)
     */
    public function vitalSigns(): HasOne
    {
        return $this->hasOne(MedicalRecordVitalSign::class, 'medical_record_id');
    }

    /**
     * ✅ Relationship with Past Medical Histories (Many-to-Many)
     */
    public function pastMedicalHistories(): BelongsToMany
    {
        return $this->belongsToMany(PastMedicalHistory::class, 'medical_record_past_medical_history')
            ->withPivot('custom_condition') // For "Others" input
            ->withTimestamps();
    }

    public function obGyneHistory(): HasOne
    {
        return $this->hasOne(ObGyneHistory::class, 'medical_record_id');
    }

    public function medicalRecordDetail(): HasOne
    {
        return $this->hasOne(MedicalRecordDetail::class, 'medical_record_id');
    }

    public function personalSocialHistory(): HasOne
    {
        return $this->hasOne(PersonalSocialHistory::class, 'medical_record_id');
    }

    public function physicalExaminations()
    {
        return $this->belongsToMany(PhysicalExamination::class, 'medical_record_physical_examination')
            ->withPivot('result', 'remarks')
            ->withTimestamps();
    }

    public function familyHistories(): BelongsToMany
    {
        return $this->belongsToMany(FamilyHistory::class, 'medical_record_family_history')
            ->withPivot('family_member', 'family_history_remarks') // Additional fields for family member and remarks
            ->withTimestamps();
    }
}
