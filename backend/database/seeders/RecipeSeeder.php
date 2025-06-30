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
                'MealType' => ucfirst($recipe['category'])
            ]);

            $dietTypeName = 'General';
            if (isset($recipe['diet']) && is_array($recipe['diet']) && count($recipe['diet']) > 0) {
                $dietTypeName = trim($recipe['diet'][0]);
            }

            $dietType = DietType::firstOrCreate([
                'DietType' => $dietTypeName
            ]);

            $allergen = Allergen::firstOrCreate([
                'Allergen' => 'None'
            ]);

            $prepTime = (int) preg_replace('/\D/', '', $recipe['time']);

            $meal = Meal::create([
                'Name' => $recipe['title'],
                'Description' => $recipe['description'],
                'Calories' => $recipe['calories'],
                'Protein' => $recipe['protein'],
                'Carbs' => $recipe['carb'],
                'Fat' => $recipe['fats'],
                'Prep_time' => $prepTime,
                'DietType_ID' => $dietType->id,
                'MealType_ID' => $mealType->id,
                'Allergen_ID' => $allergen->id
            ]);

            foreach ($recipe['ingredients'] as $ingredientData) {
                $ingredient = Ingredient::firstOrCreate(
                    ['Name' => strtolower($ingredientData['name'])],
                    [
                        'CaloriesPer100g' => $ingredientData['caloriesPer100g'] ?? 0,
                        'ProteinPer100g' => $ingredientData['proteinPer100g'] ?? 0,
                        'CarbsPer100g' => $ingredientData['carbsPer100g'] ?? 0,
                        'FatPer100g' => $ingredientData['fatPer100g'] ?? 0
                    ]
                );

                $meal->ingredients()->attach($ingredient->IngredientID);
            }
        }
    }
}
