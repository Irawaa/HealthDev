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
        Schema::create('medical_record_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id'); // 🔥 Foreign Key
            $table->text('chief_complaint')->nullable(); // Chief Complaint
            $table->text('present_illness')->nullable(); // Present Illness
            $table->text('medication')->nullable(); // Medication
            $table->boolean('hospitalized')->default(false); // Hospitalized?
            $table->text('hospitalized_reason')->nullable(); // Reason (if Yes)
            $table->boolean('previous_surgeries')->default(false); // Previous Surgeries?
            $table->text('surgery_reason')->nullable(); // Reason (if Yes)
            $table->binary('chest_xray')->nullable(); // ✅ Store Image Binary
            $table->string('vaccination_status')->nullable(); // Vaccination Status

            // 🔥 Laboratory
            $table->text('blood_chemistry')->nullable(); // Blood Chemistry
            $table->float('fbs')->nullable();            // Fasting Blood Sugar
            $table->float('uric_acid')->nullable();      // Uric Acid
            $table->float('triglycerides')->nullable();  // Triglycerides
            $table->float('t_cholesterol')->nullable();  // Total Cholesterol
            $table->float('creatinine')->nullable();     // Creatinine

            $table->timestamps();

            // Foreign Key
            $table->foreign('medical_record_id', 'fk_details_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            // Index for Performance
            $table->index('medical_record_id', 'idx_details_medical_record');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_details');
    }
};
