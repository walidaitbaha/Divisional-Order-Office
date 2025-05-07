<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function createAdmin(Request $request)
{
    try {
        $existingAdmin = User::where('role', 'admin')->first();

        if ($existingAdmin) {
            return response()->json([
                'message' => 'An admin account already exists. Only one admin is allowed.'
            ], 400); 
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin', 
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin', 
        ]);

        return response()->json([
            'message' => 'Admin account created successfully.',
            'user' => $admin
        ], 201); // 201 Created

    } catch (Exception $e) {
        return response()->json(["message" => $e->getMessage()], 500);
    }
}

    public function login(Request $request)
    {
        try {
            $user = $request->only("email", "password");
            if (!$token = JWTAuth::attempt($user)) {
                return response()->json([
                    "message" => "Email or password incorrect!",
                ], 401);
            }

            return response()->json([
                "message" => "login successfully",
                "user" => JWTAuth::user(),
                "token" => $token,
            ]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function register(Request $request)
    {
        try{
            $user = JWTAuth::parseToken()->authenticate();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'division_id' => 'nullable|exists:devisions,id',
            'role' => 'required|in:chef_division,saisie,admin',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'division_id' => $validated['division_id'],
            'role' => $validated["role"],
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User successfully registered',
            'token' => $token,
            'user' => $user,
        ], 201);
        }catch(Exception $e){
            return response()->json(["message" => $e->getMessage()],500);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out'], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }
}
