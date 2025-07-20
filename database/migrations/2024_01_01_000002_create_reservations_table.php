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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('customerName');
            $table->string('customerPhone', 20);
            $table->string('customerEmail');
            $table->date('date');
            $table->time('time');
            $table->integer('duration'); // dalam menit
            $table->integer('guests');
            $table->unsignedBigInteger('tableId');
            $table->enum('status', ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'])
                  ->default('pending');
            $table->text('specialRequests')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('tableId')->references('id')->on('tables')->onDelete('cascade');

            // Indexes untuk performa
            $table->index('tableId');
            $table->index('date');
            $table->index('status');
            $table->index(['date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
