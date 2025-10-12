<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::put('/projects/{id}', [ProjectController::class, 'update']);
Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

// Project sub-resources
Route::post('/projects/{id}/images', [ProjectController::class, 'uploadImage']);
Route::post('/projects/{id}/features', [ProjectController::class, 'addFeature']);
Route::post('/projects/{id}/floor-plans', [ProjectController::class, 'addFloorPlan']);
Route::post('/projects/{id}/payment-plans', [ProjectController::class, 'addPaymentPlan']);