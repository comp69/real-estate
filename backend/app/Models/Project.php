<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'status',
        'location',
        'location_map',
        'starting_price',
        'size_range',
        'total_units',
        'main_image',
        'brochure_pdf',
        'contact_details',
        'is_featured',
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'contact_details' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'starting_price' => 'decimal:2'
    ];

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function features()
    {
        return $this->hasMany(ProjectFeature::class);
    }

    public function floorPlans()
    {
        return $this->hasMany(FloorPlan::class);
    }

    public function paymentPlans()
    {
        return $this->hasMany(PaymentPlan::class);
    }
}

// ProjectImage Model
class ProjectImage extends Model
{
    protected $fillable = ['project_id', 'image_path', 'caption', 'display_order'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

// ProjectFeature Model
class ProjectFeature extends Model
{
    protected $fillable = ['project_id', 'feature_name', 'feature_value', 'icon'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

// FloorPlan Model
class FloorPlan extends Model
{
    protected $fillable = ['project_id', 'title', 'image_path', 'bedrooms', 'bathrooms', 'size', 'description'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

// PaymentPlan Model
class PaymentPlan extends Model
{
    protected $fillable = ['project_id', 'plan_name', 'down_payment', 'installments', 'details'];

    protected $casts = [
        'details' => 'array'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}