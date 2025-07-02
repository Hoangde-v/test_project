<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');
    \Log::info('Credentials: ', $credentials);

    $user = \App\Models\User::where('email', $credentials['email'])->first();

    if (!$user) {
        return response()->json(['message' => 'Email not found'], 401);
    }

    if (!\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
        return response()->json(['message' => 'Password incorrect'], 401);
    }

    // Nếu cả 2 đều đúng, trả về user info tạm
    return response()->json([
        'message' => 'Login OK',
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role
        ]
    ]);
}
}

