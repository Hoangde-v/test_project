<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    public function meals()
    {
        return $this->belongsToMany(Meal::class, 'ingredient_meal', 'MealID');
    }
}
