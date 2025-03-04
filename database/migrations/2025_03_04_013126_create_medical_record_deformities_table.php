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
        Schema::create('medical_record_deformities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->unsignedBigInteger('deformity_id');
            $table->string('custom_deformity')->nullable(); // For "Others"
            $table->timestamps();

            // Foreign Keys
            $table->foreign('medical_record_id', 'fk_deformity_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            $table->foreign('deformity_id', 'fk_deformity')
                ->references('id')
                ->on('deformities')
                ->onDelete('cascade');

            // Indexes
            $table->index('medical_record_id', 'idx_deformity_medical_record');
            $table->index('deformity_id', 'idx_deformity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_deformities');
    }
};
