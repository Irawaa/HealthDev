<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralReferral extends Model
{
    use HasFactory;

    protected $table = 'general_referrals';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'to',
        'address',
        'examined_on',
        'examined_due_to',
        'duration',
        'impression',
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
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
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
