<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class PreParticipatoryInterview extends Model
{
    use HasFactory;

    protected $table = 'pre_participatory_interviews';

    protected $fillable = [
        'pre_participatory_id',
        'question_id',
        'response',
        'remarks'
    ];

    /**
     * ✅ Relationship with Pre-Participatory
     */
    public function preParticipatory(): BelongsTo
    {
        return $this->belongsTo(PreParticipatory::class, 'pre_participatory_id');
    }

    /**
     * ✅ Relationship with Question
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(PreParticipatoryQuestion::class, 'question_id');
    }
}
