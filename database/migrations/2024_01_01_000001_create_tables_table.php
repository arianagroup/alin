<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->integer('number')->unique();
            $table->integer('capacity');
            $table->string('location', 50);
            $table->enum('status', ['available', 'occupied', 'reserved', 'maintenance'])
                  ->default('available');
            $table->timestamps();
            
            // Indexes untuk performa
            $table->index('status');
            $table->index('number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};