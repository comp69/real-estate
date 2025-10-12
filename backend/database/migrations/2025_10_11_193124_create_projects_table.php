<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('type'); // apartment, house, commercial
            $table->string('status'); // upcoming, ongoing, completed
            $table->string('location');
            $table->text('location_map')->nullable(); // Google Maps embed or coordinates
            $table->decimal('starting_price', 15, 2)->nullable();
            $table->string('size_range')->nullable(); // e.g., "1200-2500 sq ft"
            $table->integer('total_units')->nullable();
            $table->string('main_image')->nullable();
            $table->string('brochure_pdf')->nullable();
            $table->text('contact_details')->nullable(); // JSON format
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};