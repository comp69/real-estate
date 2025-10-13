<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

// Public routes
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/slug/{slug}', [ProjectController::class, 'show']);

// Admin routes - project management
Route::prefix('admin')->group(function () {
    Route::get('/projects/{id}', [ProjectController::class, 'showById']);
});

// Project CRUD
Route::post('/projects', [ProjectController::class, 'store']);
Route::post('/projects/{id}', [ProjectController::class, 'update']); // POST with _method=PUT
Route::put('/projects/{id}', [ProjectController::class, 'update']); // Also support direct PUT
Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

// Gallery images
Route::post('/projects/{id}/images', [ProjectController::class, 'uploadImage']);
Route::delete('/projects/{projectId}/images/{imageId}', [ProjectController::class, 'deleteImage']);

// Features
Route::post('/projects/{id}/features', [ProjectController::class, 'addFeature']);
Route::delete('/projects/{projectId}/features/{featureId}', [ProjectController::class, 'deleteFeature']);

// Floor plans
Route::post('/projects/{id}/floor-plans', [ProjectController::class, 'addFloorPlan']);
Route::delete('/projects/{projectId}/floor-plans/{floorPlanId}', [ProjectController::class, 'deleteFloorPlan']);

// Payment plans
Route::post('/projects/{id}/payment-plans', [ProjectController::class, 'addPaymentPlan']);
Route::delete('/projects/{projectId}/payment-plans/{paymentPlanId}', [ProjectController::class, 'deletePaymentPlan']);