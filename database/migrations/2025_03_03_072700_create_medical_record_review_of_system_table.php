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
        Schema::create('medical_record_review_of_system', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->unsignedBigInteger('review_of_system_id');
            $table->string('custom_symptom')->nullable(); // For "Others"
            $table->timestamps(); // Add this line ✅

            // Foreign Keys
            $table->foreign('medical_record_id', 'fk_review_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            $table->foreign('review_of_system_id', 'fk_review_symptom')
                ->references('id')
                ->on('review_of_systems')
                ->onDelete('cascade');

            // Indexes
            $table->index('medical_record_id', 'idx_review_medical_record');
            $table->index('review_of_system_id', 'idx_review_symptom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_review_of_system');
    }
};
