<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PreParticipatory extends Model
{
    use HasFactory;

    protected $table = 'pre_participatories';

    protected $fillable = [
        'patient_id',
        'school_nurse_id',
        'school_physician_id',
        'recorded_by',
        'updated_by',
        'final_evaluation',
        'further_evaluation', // Added field
        'not_cleared_for', // Added field
        'activity_specification', // Added field
    ];

    /**
     * ✅ Relationship with Patient
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * ✅ Relationship with Clinic Staff (Nurse)
     */
    public function nurse(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_nurse_id', 'staff_id');
    }

    /**
     * ✅ Relationship with Clinic Staff (Physician)
     */
    public function physician(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_physician_id', 'staff_id');
    }

    /**
     * ✅ Relationship with User (Recorded By)
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    /**
     * ✅ Relationship with Past Medical Histories (Many-to-Many)
     */
    public function pastMedicalHistories(): BelongsToMany
    {
        return $this->belongsToMany(PastMedicalHistory::class, 'pre_participatory_past_medical_history')
            ->withPivot('custom_condition')
            ->withTimestamps();
    }

    /**
     * ✅ Relationship with Vital Signs (One-to-One)
     */
    public function vitalSigns(): HasOne
    {
        return $this->hasOne(PreParticipatoryVitalSign::class, 'pre_participatory_id');
    }

    /**
     * ✅ Relationship with Physical Examinations (Many-to-Many)
     */
    public function physicalExaminations(): BelongsToMany
    {
        return $this->belongsToMany(PhysicalExamination::class, 'pre_participatory_physical_examination', 'pre_participatory_id', 'physical_examination_id')
            ->withPivot('result', 'remarks')
            ->withTimestamps();
    }

    /**
     * ✅ Relationship with Interview Questions (One-to-One)
     */
    public function interview()
    {
        return $this->hasMany(PreParticipatoryInterview::class, 'pre_participatory_id');
    }
}
