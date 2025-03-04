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
        Schema::create('medical_record_vital_signs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->string('bp', 10); // Blood Pressure
            $table->smallInteger('rr'); // Respiratory Rate
            $table->smallInteger('hr'); // Heart Rate
            $table->decimal('temperature', 4, 1); // Body Temperature
            $table->decimal('weight', 5, 2); // Weight in kg
            $table->decimal('height', 4, 2); // Height in meters
            $table->decimal('bmi', 5, 2)->storedAs('weight / (height * height)'); // Auto-calculated BMI
            $table->timestamps();

            // Foreign Key
            $table->foreign('medical_record_id', 'fk_vitals_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            // Index for performance
            $table->index('medical_record_id', 'idx_vitals_medical_record');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_vital_signs');
    }
};
