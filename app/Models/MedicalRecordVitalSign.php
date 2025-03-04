<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecordVitalSign extends Model
{
    use HasFactory;

    protected $table = 'medical_record_vital_signs';

    protected $fillable = [
        'medical_record_id',
        'bp',
        'rr',
        'hr',
        'temperature',
        'weight',
        'height',
    ];

    protected $casts = [
        'rr' => 'integer',
        'hr' => 'integer',
        'temperature' => 'float',
        'weight' => 'float',
        'height' => 'float',
        'bmi' => 'float', // Auto-generated column
    ];

    /**
     * Get the medical record associated with the vital signs.
     */
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
