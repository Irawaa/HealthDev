<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $primaryKey = 'employee_id'; // Custom primary key
    public $incrementing = true;

    protected $fillable = [
        'patient_id', 'employee_no', 'date_hired', 'is_active',
        'height', 'weight', 'blood_type', 'father_name', 'mother_name',
        'spouse_name', 'spouse_occupation', 'emergency_contact_person',
        'emergency_contact_number', 'res_brgy', 'res_city', 'res_prov',
        'res_region', 'res_zipcode', 'dept_id', 'college_id'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}
