<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreParticipatoryPastMedicalHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'pre_participatory_id',
        'past_medical_history_id',
        'custom_condition'
    ];

    public function preParticipatory()
    {
        return $this->belongsTo(PreParticipatory::class, 'pre_participatory_id');
    }

    public function pastMedicalHistory()
    {
        return $this->belongsTo(PastMedicalHistory::class, 'past_medical_history_id');
    }
}
