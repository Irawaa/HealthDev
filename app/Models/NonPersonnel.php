<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NonPersonnel extends Model
{
    use HasFactory;

    protected $table = 'non_personnel';

    protected $primaryKey = 'non_personnel_id'; 
    public $incrementing = true;

    protected $fillable = [
        'patient_id', 'affiliation', 'height', 'weight', 'blood_type', 
        'father_name', 'mother_name', 'spouse_name', 'spouse_occupation', 
        'emergency_contact_person', 'emergency_contact_number', 
        'res_brgy', 'res_city', 'res_prov', 'res_region', 'res_zipcode'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}
