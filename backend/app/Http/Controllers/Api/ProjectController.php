<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['images', 'features', 'floorPlans', 'paymentPlans'])
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects);
    }

    // Get project by slug (for public frontend)
    public function show($slug)
    {
        $project = Project::with(['images', 'features', 'floorPlans', 'paymentPlans'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($project);
    }

    // Get project by ID (for admin panel)
    public function showById($id)
    {
        $project = Project::with(['images', 'features', 'floorPlans', 'paymentPlans'])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($project);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string',
            'status' => 'required|string',
            'location' => 'required|string',
            'main_image' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);

        // ✅ Safely convert booleans
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active', true);

        if ($request->hasFile('main_image')) {
            $data['main_image'] = $request->file('main_image')->store('projects', 'public');
        }

        if ($request->has('contact_details')) {
            $data['contact_details'] = json_decode($request->contact_details, true);
        }

        $project = Project::create($data);
        $project->load(['images', 'features', 'floorPlans', 'paymentPlans']);

        return response()->json($project, 201);
    }

    // ✅ Updated update method to handle both PUT and POST with _method
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'main_image' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['_method']);

        if ($request->hasFile('main_image')) {
            if ($project->main_image) {
                Storage::disk('public')->delete($project->main_image);
            }
            $data['main_image'] = $request->file('main_image')->store('projects', 'public');
        }

        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title);
        }

        if ($request->has('contact_details')) {
            $data['contact_details'] = is_string($request->contact_details)
                ? json_decode($request->contact_details, true)
                : $request->contact_details;
        }

        // ✅ Safely convert string/checkbox values to booleans
        if ($request->has('is_featured')) {
            $data['is_featured'] = $request->boolean('is_featured');
        }
        
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        // Convert numeric fields
        if ($request->has('starting_price')) {
            $data['starting_price'] = $request->starting_price;
        }

        if ($request->has('total_units')) {
            $data['total_units'] = $request->total_units;
        }

        // Update the project
        $project->update($data);

        // Return updated project with relationships
        $project->refresh();
        $project->load(['images', 'features', 'floorPlans', 'paymentPlans']);

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        
        if ($project->main_image) {
            Storage::disk('public')->delete($project->main_image);
        }

        // Delete related images
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        // Delete floor plan images
        foreach ($project->floorPlans as $plan) {
            Storage::disk('public')->delete($plan->image_path);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function uploadImage(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:5120',
            'caption' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('projects/gallery', 'public');

        $image = $project->images()->create([
            'image_path' => $imagePath,
            'caption' => $request->caption ?? '',
            'display_order' => $project->images()->count()
        ]);

        return response()->json($image, 201);
    }

    // Add delete image method
    public function deleteImage($projectId, $imageId)
    {
        $project = Project::findOrFail($projectId);
        $image = $project->images()->findOrFail($imageId);
        
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function addFeature(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'feature_name' => 'required|string',
            'feature_value' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $feature = $project->features()->create($request->all());

        return response()->json($feature, 201);
    }

    // Add delete feature method
    public function deleteFeature($projectId, $featureId)
    {
        $project = Project::findOrFail($projectId);
        $feature = $project->features()->findOrFail($featureId);
        $feature->delete();

        return response()->json(['message' => 'Feature deleted successfully']);
    }

    public function addFloorPlan(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'image' => 'required|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('projects/floorplans', 'public');

        $floorPlan = $project->floorPlans()->create([
            'title' => $request->title,
            'image_path' => $imagePath,
            'bedrooms' => $request->bedrooms ?? '',
            'bathrooms' => $request->bathrooms ?? '',
            'size' => $request->size ?? '',
            'description' => $request->description ?? '',
        ]);

        return response()->json($floorPlan, 201);
    }

    // Add delete floor plan method
    public function deleteFloorPlan($projectId, $floorPlanId)
    {
        $project = Project::findOrFail($projectId);
        $floorPlan = $project->floorPlans()->findOrFail($floorPlanId);
        
        Storage::disk('public')->delete($floorPlan->image_path);
        $floorPlan->delete();

        return response()->json(['message' => 'Floor plan deleted successfully']);
    }

    public function addPaymentPlan(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'plan_name' => 'required|string',
            'down_payment' => 'required|string',
            'installments' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if ($request->has('details') && is_string($request->details)) {
            $data['details'] = json_decode($request->details, true);
        }

        $paymentPlan = $project->paymentPlans()->create($data);

        return response()->json($paymentPlan, 201);
    }

    // Add delete payment plan method
    public function deletePaymentPlan($projectId, $paymentPlanId)
    {
        $project = Project::findOrFail($projectId);
        $paymentPlan = $project->paymentPlans()->findOrFail($paymentPlanId);
        $paymentPlan->delete();

        return response()->json(['message' => 'Payment plan deleted successfully']);
    }
}