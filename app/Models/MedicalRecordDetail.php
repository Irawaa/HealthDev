<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecordDetail extends Model
{
    use HasFactory;

    protected $table = 'medical_record_details'; // Table Name

    protected $fillable = [
        'medical_record_id',
        'chief_complaint',
        'present_illness',
        'medication',
        'hospitalized',
        'hospitalized_reason',
        'previous_surgeries',
        'surgery_reason',
        'chest_xray',
        'vaccination_status',
        'blood_chemistry',
        'fbs',
        'uric_acid',
        'triglycerides',
        't_cholesterol',
        'creatinine',
    ];

    protected $casts = [
        'hospitalized' => 'boolean',
        'previous_surgeries' => 'boolean',
        'fbs' => 'float',
        'uric_acid' => 'float',
        'triglycerides' => 'float',
        't_cholesterol' => 'float',
        'creatinine' => 'float',
    ];

    // 🔥 Relationship to MedicalRecord
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    // ✅ Accessor to Decode Image
    public function getChestXrayAttribute($value)
    {
        return base64_encode($value);
    }
}
