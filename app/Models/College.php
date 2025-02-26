<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class College extends Model
{
    protected $primaryKey = 'college_id';
    public $incrementing = false;
    protected $fillable = ['description', 'college_code', 'is_active'];

    public function programs()
    {
        return $this->hasMany(Program::class, 'college_id', 'college_id')->where('is_active', 1);
    }
}
