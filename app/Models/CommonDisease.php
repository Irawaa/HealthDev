<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CommonDisease extends Model
{
    use HasFactory;

    protected $table = 'common_diseases';

    protected $fillable = [
        'name',
    ];

    /**
     * Relationship with FDAR Forms (Many-to-Many)
     * This links Common Diseases to multiple FDAR forms.
     */
    public function fdarForms(): BelongsToMany
    {
        return $this->belongsToMany(FDARForm::class, 'fdar_form_common_disease', 'common_disease_id', 'fdar_form_id')
            ->withTimestamps();
    }
}
