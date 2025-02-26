<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'patient_id', 'stud_id', 'is_vaccinated', 'college_id', 'program_id',
        'father_name', 'father_birthdate', 'father_occupation',
        'mother_name', 'mother_birthdate', 'mother_occupation',
        'guardian_name', 'guardian_relation', 'guardian_contactno',
        'address_house', 'address_brgy', 'address_citytown',
        'address_province', 'address_zipcode',
        'emergency_contact_name', 'emergency_contact_no'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}

