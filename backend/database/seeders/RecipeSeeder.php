<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Meal;
use App\Models\Ingredient;
use App\Models\DietType;
use App\Models\MealType;
use App\Models\Allergen;

class RecipeSeeder extends Seeder
{
    public function run()
    {
        $json = File::get(database_path('data/RecipesData.json'));
        $recipes = json_decode($json, true);

        foreach ($recipes as $recipe) {
            $mealType = MealType::firstOrCreate([
                'mealType' => ucfirst($recipe['category'])
            ]);

            $dietTypeName = 'General';
            if (isset($recipe['diet']) && is_array($recipe['diet']) && count($recipe['diet']) > 0) {
                $dietTypeName = trim($recipe['diet'][0]);
            }

            $dietType = DietType::firstOrCreate([
                'dietType' => $dietTypeName
            ]);

            $allergen = Allergen::firstOrCreate([
                'allergen' => 'None'
            ]);

            $prepTime = (int) preg_replace('/\D/', '', $recipe['time']);

            $meal = Meal::create([
                'name' => $recipe['title'],
                'description' => $recipe['description'],
                'calories' => $recipe['calories'],
                'protein' => $recipe['protein'],
                'carbs' => $recipe['carb'],
                'fat' => $recipe['fats'],
                'price' => $recipe['price'],
                'prep_time' => $prepTime,
                'dietType_ID' => $dietType->id,
                'mealType_ID' => $mealType->id,
                'allergen_ID' => $allergen->id
            ]);

            foreach ($recipe['ingredients'] as $ingredientData) {
                $ingredient = Ingredient::firstOrCreate(
                    ['name' => strtolower($ingredientData['name'])],
                    [
                        'caloriesPer100g' => $ingredientData['caloriesPer100g'] ?? 0,
                        'proteinPer100g' => $ingredientData['proteinPer100g'] ?? 0,
                        'carbsPer100g' => $ingredientData['carbsPer100g'] ?? 0,
                        'fatPer100g' => $ingredientData['fatPer100g'] ?? 0
                    ]
                );

                $meal->ingredients()->attach($ingredient->IngredientID);
            }
        }
    }
}
