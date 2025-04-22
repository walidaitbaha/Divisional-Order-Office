<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\CheckAuthentication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/logout", [AuthController::class, "logout"])->middleware(CheckAuthentication::class);
});
