<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BPReading extends Model
{
    use HasFactory;

    protected $table = 'bp_readings';

    protected $fillable = [
        'bp_form_id',
        'date',
        'time',
        'blood_pressure',
        'has_signature',
        'remarks',
    ];

    public function bpForm(): BelongsTo
    {
        return $this->belongsTo(BPForm::class, 'bp_form_id', 'id');
    }
}
