<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FDARForm extends Model
{
    use HasFactory;

    protected $table = 'fdar_forms';

    protected $fillable = [
        'patient_id',
        'school_nurse_id',
        'recorded_by',
        'updated_by',
        'weight',
        'height',
        'blood_pressure',
        'cardiac_rate',
        'respiratory_rate',
        'temperature',
        'oxygen_saturation',
        'last_menstrual_period',
        'data',
        'action',
        'response',
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
     * Relationship with Clinic Staff (Recorder)
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'recorded_by', 'staff_id');
    }

    /**
     * Relationship with User (Updated By)
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }

    /**
     * Relationship with Common Diseases (Many-to-Many)
     * This links FDAR forms to multiple diseases (as the focus).
     */
    public function commonDiseases(): BelongsToMany
    {
        return $this->belongsToMany(CommonDisease::class, 'fdar_form_common_disease', 'fdar_form_id', 'common_disease_id')
            ->withTimestamps();
    }
}
