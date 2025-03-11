<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentReport extends Model
{
    use HasFactory;

    protected $table = 'incident_reports';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'history',
        'nature_of_incident',
        'place_of_incident',
        'date_of_incident',
        'time_of_incident',
        'description_of_injury',
        'management',
        'hospital_specification',
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

    // 📌 Relationship with User who recorded the report
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    // 📌 Relationship with User who last updated the report
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
