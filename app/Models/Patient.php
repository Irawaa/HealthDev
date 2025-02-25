<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients'; // Explicitly define table name

    protected $primaryKey = 'patient_id'; // Set custom primary key

    public $timestamps = true; // Enable timestamps (created_at, updated_at)

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
}
