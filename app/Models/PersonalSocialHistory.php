<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalSocialHistory extends Model
{
    use HasFactory;

    protected $table = 'medical_record_personal_social_history'; // Custom Table Name

    protected $fillable = [
        'medical_record_id',
        'alcoholic_drinker',
        'smoker',
        'sticks_per_day',
        'years_smoking',
        'illicit_drugs',
        'eye_glasses',
        'contact_lens',
        'eye_disorder_no',
    ];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
