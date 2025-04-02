<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PreParticipatoryQuestion extends Model
{
    use HasFactory;

    protected $table = 'pre_participatory_questions';

    protected $fillable = ['id, question'];

    /**
     * ✅ Many-to-Many Relationship with Pre-Participatory
     */
    public function preParticipatories(): BelongsToMany
    {
        return $this->belongsToMany(PreParticipatory::class, 'pre_participatory_interviews', 'question_id', 'pre_participatory_id')
            ->withPivot('response', 'remarks')
            ->withTimestamps();
    }
}
