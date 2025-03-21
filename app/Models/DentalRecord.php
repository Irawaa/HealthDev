<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DentalRecord extends Model
{
    use HasFactory;

    protected $table = 'dental_records';

    protected $fillable = [
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
        'updated_by'
    ];

    /**
     * Relationship with Patient
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * Relationship with School Dentist
     */
    public function dentist(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_dentist_id', 'staff_id');
    }

    /**
     * Relationship with School Nurse
     */
    public function nurse(): BelongsTo
    {
        return $this->belongsTo(ClinicStaff::class, 'school_nurse_id', 'staff_id');
    }

    /**
     * Relationship with the User who recorded the entry
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    /**
     * Relationship with the User who last updated
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }

    /**
     * Accessor for dental record chart JSON
     */
    public function getDentalRecordChartAttribute($value)
    {
        // Attempt to decode JSON, fallback to original if invalid
        $decoded = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }    

    /**
     * Mutator for dental record chart JSON
     */
    public function setDentalRecordChartAttribute($value)
    {
        $this->attributes['dental_record_chart'] = json_encode($value);
    }
}
