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
}
