<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FDARFormCommonDisease extends Model
{
    use HasFactory;

    protected $table = 'fdar_form_common_disease';

    protected $fillable = ['fdar_form_id', 'common_disease_id', 'custom_disease'];

    public function fdarForm()
    {
        return $this->belongsTo(FDARForm::class, 'fdar_form_id');
    }

    public function commonDisease()
    {
        return $this->belongsTo(CommonDisease::class, 'common_disease_id');
    }
}
