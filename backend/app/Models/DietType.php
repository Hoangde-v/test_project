<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietType extends Model
{
    public function meals() {
        return $this->hasMany(Meal::class, 'DietType_ID');
    }
}
