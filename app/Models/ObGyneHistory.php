<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObGyneHistory extends Model
{
    use HasFactory;

    protected $table = 'medical_record_ob_gyne_history'; // Custom Table Name

    protected $fillable = [
        'medical_record_id',
        'menstruation',
        'duration',
        'dysmenorrhea',
        'pregnant_before',
        'num_of_pregnancies',
        'last_menstrual_period',
    ];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}

