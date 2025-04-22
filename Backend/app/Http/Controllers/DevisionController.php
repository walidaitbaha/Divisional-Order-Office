<?php

namespace App\Http\Controllers;

use App\Models\Devision;
use Exception;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class DevisionController extends Controller
{
    public function get(){
        try{
            $devisions = Devision::all();
            if(!$devisions){
                return response()->json(["message" => "devisions not found"],404);
            }
            return response()->json(["Devisions" => $devisions],200);
        }catch(Exception $e){
            return response()->json(["message" => $e->getMessage()],500);
        }
    }

    public function create(Request $request){
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
            }

            $validated = $request->validate([
                "name" => 'required|string|max:255',
                "description" =>'required|string|max:255',
            ]);

            $devision = Devision::create([
                "name" => $validated["name"],
                "description" => $validated["description"]
            ]);

            return response()->json([
                "message" => "devision created",
                "devision" => $devision
            ],200);

        }catch(Exception $e){
            return response()->json(["message" => $e->getMessage()],500);
        }
    }
}
