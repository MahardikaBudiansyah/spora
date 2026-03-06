<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AddressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/indonesia/provinces', [AddressController::class, 'provinces']);
Route::get('/indonesia/cities', [AddressController::class, 'cities']);
Route::get('/indonesia/districts', [AddressController::class, 'districts']);
Route::get('/indonesia/villages', [AddressController::class, 'villages']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'user' => $user ? $user : null,
        'session_id' => session()->getId(),
    ]);
});
