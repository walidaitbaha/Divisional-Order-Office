<?php

namespace App\Http\Controllers;

use App\Models\Exp_Des;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ExpDesController extends Controller
{
    public function get(){
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user){
                return response()->json(['message' => 'Unauthorized.'], 401);
            }

            $exp_des = Exp_Des::all();
            return response()->json([
                "exp_des" => $exp_des
            ],200);
        }catch(Exception $e){
            return response()->json([
                "message" => $e->getMessage()
            ],500);
        }
    }

    public function create(Request $request){
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || $user->role !== "admin"){
                return response()->json(['message' => 'Unauthorized.'], 401);
            }

            $validated = $request->validate([
                "name" => "required|string|max:255"
            ]);

            $exp_des = Exp_Des::create([
                "name" => $validated["name"]
            ]);

            return response()->json([
                "message" => "exp-des created",
                "exp_des" => $exp_des
            ],200);
        }catch(Exception $e){
            return response()->json([
                "message" => $e->getMessage()
            ],500);
        }
    }

    public function update(Request $request, $id){
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || $user->role !== "admin"){
                return response()->json(['message' => 'Unauthorized.'], 401);
            }

            $exp_des = Exp_Des::findOrFail($id);
            $validated = $request->validate([
                "name" => "nullable|string|max:255"
            ]);

            $exp_des->update($validated);
            return response()->json([
                "message" => "exp_des updated",
                "exp_des" => $exp_des
            ],200);
        }catch(Exception $e){
            return response()->json([
                "message" => $e->getMessage()
            ],500);
        }
    }

    public function delete($id){
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || $user->role !== "admin"){
                return response()->json(['message' => 'Unauthorized.'], 401);
            }
            $exp_des = Exp_Des::findOrFail($id);
            $exp_des->delete();
            return response()->json([
                "message" => "exp_des deleted"
            ],200);
        }catch(Exception $e){
            return response()->json([
                "message" => $e->getMessage()
            ],500);
        }
    }
}
