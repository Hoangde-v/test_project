<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allergen extends Model
{
    public function meals()
    {
        return $this->belongsTo(Meal::class, 'meal', 'Allergen_ID');
    }
}
