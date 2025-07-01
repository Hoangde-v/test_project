<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->text('Description');
            $table->integer('Calories');
            $table->decimal('Protein', 5, 2);
            $table->decimal('Carbs', 5, 2);
            $table->decimal('Fat', 5, 2);
            $table->decimal('price', 6, 2);
            $table->integer('Prep_time');
            $table->foreignId('DietType_ID')->constrained('diet_types');
            $table->foreignId('MealType_ID')->constrained('meal_types' );
            $table->foreignId('Allergen_ID')->constrained('allergens');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
