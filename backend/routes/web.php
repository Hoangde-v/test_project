<?php

use App\Http\Middleware\AuthApiToken;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\CheckRole;

Route::get('/', function () {
    return view('welcome');
});




Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', CheckRole::class . ':admin'])->get('/admin', function () {
    return response()->json(['message' => 'Hello Admin']);
});

Route::middleware(['auth:sanctum', CheckRole::class . ':user'])->get('/user', function () {
    return response()->json(['message' => 'Hello User']);
});
