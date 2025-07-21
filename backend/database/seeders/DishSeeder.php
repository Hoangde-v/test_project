<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Meal;
use App\Models\Ingredient;
use App\Models\DietType;
use App\Models\MealType;
use App\Models\Allergen;

class DishSeeder extends Seeder
{
    public function run()
    {
        $json = File::get(database_path('data/DishesData.json'));
        $dishes = json_decode($json, true);

        foreach ($dishes as $dish) {
            $mealType = MealType::firstOrCreate([
                'mealType' => ucfirst($dish['category'])
            ]);

            $dietTypeName = 'General';
            if (isset($dish['diet']) && is_array($dish['diet']) && count($dish['diet']) > 0) {
                $dietTypeName = trim($dish['diet'][0]);
            }

            $dietType = DietType::firstOrCreate([
                'dietType' => $dietTypeName
            ]);

            $allergen = Allergen::firstOrCreate([
                'allergen' => 'None'
            ]);

            $prepTime = (int) preg_replace('/\D/', '', $dish['time']);

            $meal = Meal::create([
                'name' => $dish['title'],
                'description' => $dish['description'],
                'calories' => $dish['calories'],
                'protein' => $dish['protein'],
                'carbs' => $dish['carb'],
                'fat' => $dish['fats'],
                'price' => $dish['price'],
                'prep_time' => $prepTime,
                'dietType_ID' => $dietType->id,
                'mealType_ID' => $mealType->id,
                'allergen_ID' => $allergen->id
            ]);

            foreach ($dish['ingredients'] as $ingredientData) {
                $ingredient = Ingredient::firstOrCreate(
                    ['name' => strtolower($ingredientData['name'])],
                    [
                        'caloriesPer100g' => $ingredientData['caloriesPer100g'] ?? 0,
                        'proteinPer100g' => $ingredientData['proteinPer100g'] ?? 0,
                        'carbsPer100g' => $ingredientData['carbsPer100g'] ?? 0,
                        'fatPer100g' => $ingredientData['fatPer100g'] ?? 0
                    ]
                );

                $meal->ingredients()->attach($ingredient->id);
            }
        }
    }
}
