<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngredientMeal extends Model
{
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_meal', 'MealID', 'IngredientID');
    }

    public function meals()
    {
        return $this->belongsToMany(Meal::class, 'ingredient_meal', 'IngredientID', 'MealID');
    }
}
