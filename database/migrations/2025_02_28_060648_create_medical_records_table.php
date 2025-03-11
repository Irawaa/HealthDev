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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id', 'fk_medical_patient_id')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            // Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // Final Evaluation
            $table->enum('final_evaluation', ['Class A', 'Class B', 'Pending'])
                ->nullable();

            // Plan/Recommendation
            $table->text('plan_recommendation')
                ->nullable();

            // Tracking Information
            $table->timestamps(); // Includes `created_at` and `updated_at`
            $table->unsignedInteger('updated_by')->nullable();

            // Indexes
            $table->index('patient_id', 'idx_medical_patient_id');
            $table->index('recorded_by', 'idx_medical_recorded_by');

            // Foreign Keys
            $table->foreign('school_nurse_id', 'fk_medical_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_medical_physician')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_medical_recorded_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_medical_updated_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
