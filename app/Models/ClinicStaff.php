<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicStaff extends Model
{
    use HasFactory;

    protected $table = 'clinic_staffs';
    protected $primaryKey = 'staff_id';
    public $timestamps = true;

    protected $fillable = [
        'lname',
        'fname',
        'mname',
        'ext',
        'role',
        'license_no',
        'ptr_no',
        'email',
        'contact_no'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'staff_id', 'staff_id');
    }
}
