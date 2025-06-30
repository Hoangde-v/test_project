<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealType extends Model
{
    public function meals() {
        return $this->hasMany(Meal::class, 'MealType_ID');
    }
}
