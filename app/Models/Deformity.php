<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deformity extends Model
{
    use HasFactory;

    protected $table = 'deformities'; // Explicitly define table name (optional if it follows Laravel convention)

    protected $fillable = ['symptom']; // Define mass-assignable attributes

    public $timestamps = false; // Since your migration doesn't include timestamps

    // Relationship with MedicalRecord (Many-to-Many)
    public function medicalRecords()
    {
        return $this->belongsToMany(MedicalRecord::class, 'medical_record_deformities', 'deformity_id', 'medical_record_id');
    }
}
