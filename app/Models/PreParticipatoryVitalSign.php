<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreParticipatoryVitalSign extends Model
{
    use HasFactory;

    protected $fillable = [
        'pre_participatory_id',
        'bp',
        'rr',
        'hr',
        'temperature',
        'weight',
        'height',
        'bmi'
    ];

    // 🏥 Relationship with PreParticipatory
    public function preParticipatory()
    {
        return $this->belongsTo(PreParticipatory::class);
    }
}
