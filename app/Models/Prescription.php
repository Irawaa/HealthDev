<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $table = 'prescriptions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'school_nurse_id',
        'school_physician_id',
        'prescription_image',
        'updated_by',
        'recorded_by',
        'prescription_number',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($prescription) {
            if (is_null($prescription->prescription_number)) {
                $prescription->prescription_number = $prescription->id; // Use `id` as its value
                $prescription->save();
            }
        });
    }

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
