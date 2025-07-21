<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    
    public function dietType()
    {
        return $this->belongsTo(DietType::class, 'DietType_ID');
    }

    public function mealType()
    {
        return $this->belongsTo(MealType::class, 'MealType_ID');
    }

    public function allergen()
    {
        return $this->belongsTo(Allergen::class, 'Allergen_ID');
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_meal','meal_id', 'ingredient_id');
    }
}
