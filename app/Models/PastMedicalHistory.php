<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PastMedicalHistory extends Model
{
    use HasFactory;

    // ✅ Table Name (if different from default 'past_medical_histories')
    protected $table = 'past_medical_histories';

    // ✅ Allow Mass Assignment for 'condition_name'
    protected $fillable = ['condition_name'];

    // ✅ Disable Timestamps (if not using created_at & updated_at)
    public $timestamps = false;

    /**
     * ✅ Define Relationship: Many-to-Many with Medical Records
     */
    public function medicalRecords()
    {
        return $this->belongsToMany(MedicalRecord::class, 'medical_record_past_medical_history')
            ->withPivot('custom_condition') // For 'Others' input
            ->withTimestamps();
    }

    public function preParticipatories()
    {
        return $this->belongsToMany(PreParticipatory::class, 'pre_participatory_past_medical_history')
            ->withPivot('custom_condition')
            ->withTimestamps();
    }
}
