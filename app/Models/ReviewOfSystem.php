<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewOfSystem extends Model
{
    use HasFactory;

    protected $fillable = ['symptom'];

    public function medicalRecords()
    {
        return $this->belongsToMany(MedicalRecord::class, 'medical_record_review_of_system')
            ->withPivot('custom_symptom')
            ->withTimestamps();
    }
}
