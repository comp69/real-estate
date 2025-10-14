<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

// Public routes - IMPORTANT: Put slug route BEFORE numeric ID routes
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->where('slug', '[a-z0-9\-]+');

// Admin routes - project management (numeric ID only)
Route::prefix('admin')->group(function () {
    Route::get('/projects/{id}', [ProjectController::class, 'showById'])->where('id', '[0-9]+');
});

// Project uploads and management
Route::post('/projects', [ProjectController::class, 'store']);
Route::post('/projects/{id}', [ProjectController::class, 'update'])->where('id', '[0-9]+'); // POST with _method=PUT
Route::put('/projects/{id}', [ProjectController::class, 'update'])->where('id', '[0-9]+'); // Also support direct PUT
Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->where('id', '[0-9]+');

// Gallery images
Route::post('/projects/{id}/images', [ProjectController::class, 'uploadImage'])->where('id', '[0-9]+');
Route::delete('/projects/{projectId}/images/{imageId}', [ProjectController::class, 'deleteImage'])->where(['projectId' => '[0-9]+', 'imageId' => '[0-9]+']);

// Features
Route::post('/projects/{id}/features', [ProjectController::class, 'addFeature'])->where('id', '[0-9]+');
Route::delete('/projects/{projectId}/features/{featureId}', [ProjectController::class, 'deleteFeature'])->where(['projectId' => '[0-9]+', 'featureId' => '[0-9]+']);

// Floor plans
Route::post('/projects/{id}/floor-plans', [ProjectController::class, 'addFloorPlan'])->where('id', '[0-9]+');
Route::delete('/projects/{projectId}/floor-plans/{floorPlanId}', [ProjectController::class, 'deleteFloorPlan'])->where(['projectId' => '[0-9]+', 'floorPlanId' => '[0-9]+']);

// Payment plans
Route::post('/projects/{id}/payment-plans', [ProjectController::class, 'addPaymentPlan'])->where('id', '[0-9]+');
Route::delete('/projects/{projectId}/payment-plans/{paymentPlanId}', [ProjectController::class, 'deletePaymentPlan'])->where(['projectId' => '[0-9]+', 'paymentPlanId' => '[0-9]+']);
