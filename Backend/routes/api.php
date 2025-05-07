<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DevisionController;
use App\Http\Controllers\ExpDesController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckAuthentication;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post("/createadmin", [AuthController::class, "createAdmin"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"])->middleware(CheckRole::class . ":admin");
    Route::post("/logout", [AuthController::class, "logout"])->middleware(CheckAuthentication::class);
});

Route::prefix("user")->group(function () {
    Route::get("/getUsers", [UserController::class, "getUsers"])->middleware(CheckRole::class . ":admin");
    Route::put("/updateUser/{id}", [UserController::class, "updateUser"])->middleware(CheckRole::class . ":admin");
    Route::get("/filterUsersByRole/{role}", [UserController::class, "filterUserByRole"])->middleware(CheckRole::class . ":admin");
    Route::delete("/deleteUser/{id}", [UserController::class, "destroyUser"])->middleware(CheckRole::class . ":admin");
});


Route::prefix("devision")->group(function () {
    Route::get("/get", [DevisionController::class, "get"]);
    Route::post("/create", [DevisionController::class, "create"])->middleware(CheckRole::class . ":admin");
    Route::put("/update/{id}", [DevisionController::class, "update"])->middleware(CheckRole::class . ":admin");
    Route::delete("/delete/{id}", [DevisionController::class, "destroy"])->middleware(CheckRole::class . ":admin");
});

Route::prefix("message")->group(function () {
    Route::get("/getMessageOfDevision", [MessageController::class, "getMessageOfDevision"]);

    Route::get("getMessageOfDevisions", [MessageController::class, "getMessageOfDevisions"])
        ->middleware(CheckRole::class . ":admin");

    Route::post("/store", [MessageController::class, "store"])
        ->middleware(CheckRole::class . ":saisie");

    Route::put("/update/{id}", [MessageController::class, "update"])
        ->middleware(CheckRole::class . ":chef_division, admin");

    Route::delete("/delete/{id}", [MessageController::class, "destroy"])
        ->middleware(CheckRole::class . ":chef_division, admin");

    Route::get("/softdelete",[MessageController::class, "getDeletedMessages"])
        ->middleware(CheckRole::class . ":admin");
});

Route::prefix("exp_des")->group(function(){
    Route::get("/getExpDes",[ExpDesController::class, "get"]);
    Route::post("/createExpDes",[ExpDesController::class, "create"])
    ->middleware(CheckRole::class . ":admin");
    Route::put("/updateExpDes/{id}",[ExpDesController::class, "update"])
    ->middleware(CheckRole::class . ":admin");
    Route::delete("/deleteExpDes/{id}",[ExpDesController::class, "delete"])
    ->middleware(CheckRole::class . ":admin");
});
