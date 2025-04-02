<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pre_participatory_vital_signs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pre_participatory_id');
            $table->string('bp', 10); // Blood Pressure
            $table->smallInteger('rr'); // Respiratory Rate
            $table->smallInteger('hr'); // Heart Rate
            $table->decimal('temperature', 4, 1); // Body Temperature
            $table->decimal('weight', 5, 2); // Weight in kg
            $table->integer('height'); // Height in centimeters
            $table->decimal('bmi', 5, 2)->storedAs('weight / ((height / 100) * (height / 100))'); // BMI calculation using height in cm
            $table->timestamps();

            // Foreign Key
            $table->foreign('pre_participatory_id', 'fk_vitals_pre_participatory')
                ->references('id')
                ->on('pre_participatories')
                ->onDelete('cascade');

            // Index for performance
            $table->index('pre_participatory_id', 'idx_vitals_pre_participatory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_participatory_vital_signs');
    }
};
