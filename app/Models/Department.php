<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments'; // Explicitly set the table name (optional)

    protected $primaryKey = 'dept_id'; // Explicitly define the primary key

    protected $fillable = [
        'name',
        'acronym',
        'division',
        'level',
        'is_college',
        'dept_head',
        'is_active',
    ];
}
