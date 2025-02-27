<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients'; // Explicitly define table name

    protected $primaryKey = 'patient_id'; // Set custom primary key

    protected $fillable = [
        'type',
        'lname',
        'fname',
        'mname',
        'ext',
        'birthdate',
        'gender',
        'civil_status',
        'email',
        'mobile',
        'telephone',
        'updated_by',
    ];

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id')->withDefault();
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'patient_id', 'patient_id');
    }

    public function personnel()
    {
        return $this->hasOne(Employee::class, 'patient_id', 'patient_id');
    }
}
