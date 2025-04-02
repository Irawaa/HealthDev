<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreParticipatoryPhysicalExamination extends Model
{
    use HasFactory;

    protected $fillable = [
        'pre_participatory_id',
        'physical_examination_id',
        'result',
        'remarks'
    ];

    public function preParticipatory()
    {
        return $this->belongsTo(PreParticipatory::class, 'pre_participatory_id');
    }

    public function physicalExamination()
    {
        return $this->belongsTo(PhysicalExamination::class, 'physical_examination_id');
    }
}
