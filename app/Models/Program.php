<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $primaryKey = 'program_id';
    protected $fillable = [
        'description',
        'program_code',
        'section_code',
        'college_id',
        'p_id',
        'type',
        'is_active',
        'is_board'
    ];

    public function college()
    {
        return $this->belongsTo(College::class, 'college_id', 'college_id');
    }
}
