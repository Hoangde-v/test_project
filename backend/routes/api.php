<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\CheckRole;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', CheckRole::class . ':admin'])->get('/admin', function () {
    return response()->json(['message' => 'Hello Admin']);
});

Route::middleware(['auth:sanctum', CheckRole::class . ':user'])->get('/user', function () {
    return response()->json(['message' => 'Hello User']);
});

Route::post('/register', [AuthController::class, 'register']);