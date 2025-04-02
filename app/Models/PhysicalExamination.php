<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhysicalExamination extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function medicalRecords()
    {
        return $this->belongsToMany(MedicalRecord::class, 'medical_record_physical_examination')
            ->withPivot('result', 'remarks')
            ->withTimestamps();
    }

    public function preParticipatories()
    {
        return $this->belongsToMany(PreParticipatory::class, 'pre_participatory_physical_examination', 'physical_examination_id', 'pre_participatory_id')
            ->withPivot('result', 'remarks')
            ->withTimestamps();
    }
}
