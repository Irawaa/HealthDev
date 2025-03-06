<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'condition',  // The name of the condition, e.g., "Cancer"
    ];

    /**
     * The medical records that belong to the family history condition.
     */
    public function medicalRecords()
    {
        return $this->belongsToMany(MedicalRecord::class, 'medical_record_family_history')
                    ->withPivot('family_member', 'remarks')  // Include the pivot fields
                    ->withTimestamps();
    }
}
