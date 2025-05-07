<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getUsers()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user || $user->role !== "admin") {
                return response()->json(["message" => "Unauthorized"], 403);
            }

            $users = User::with('devisions')->paginate(4);

            return response()->json(["users" => $users], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function filterUserByRole($role)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if (!$authUser || $authUser->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
            }

            if (!in_array($role, ['agent', 'chef_division', 'saisie', 'admin'])) {
                return response()->json(['message' => 'Invalid role specified.'], 400);
            }

            $users = User::with('devisions')
                    ->where('role', $role)
                    ->paginate(4);
            return response()->json(["users" => $users], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if (!$authUser || $authUser->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'division_id' => 'nullable|exists:devisions,id',
                'role' => 'required|in:agent,chef_division,saisie,admin',
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user
            ],200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function destroyUser($id){
        try{
            $authUser = JWTAuth::parseToken()->authenticate();

            if (!$authUser || $authUser->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $user->delete();
            return response()->json(["message" => "User deleted successfully"],200);
        }catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
