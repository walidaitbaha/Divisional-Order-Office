<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if($user){
                return $next($request);
            }

            return response()->json([
                'message' => "Unauthorized"
            ],401);

        }catch(Exception $ex){
            return response()->json([
                'message' => $ex->getMessage(),
            ]);
        }
    }
}