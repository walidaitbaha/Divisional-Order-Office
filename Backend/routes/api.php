<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DevisionController;
use App\Http\Middleware\CheckAuthentication;
use App\Http\Middleware\CheckRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post("/createadmin", [AuthController::class, "createAdmin"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"])->middleware(CheckRole::class . ":admin");
    Route::post("/logout", [AuthController::class, "logout"])->middleware(CheckAuthentication::class);
});


Route::prefix("devision")->group(function () {
    Route::get("/get", [DevisionController::class, "get"]);
    Route::post("/create", [DevisionController::class, "create"])->middleware(CheckRole::class . ":admin");
});