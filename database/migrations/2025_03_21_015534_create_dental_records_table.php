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
        Schema::create('dental_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedSmallInteger('school_dentist_id');
            $table->unsignedSmallInteger('school_nurse_id');

            // Detailed Dental Record Chart
            $table->text('dental_record_chart')->nullable();
            $table->text('teeth_details')->nullable();

            // Initial Periodontal Examination
            $table->enum('gingival_status', ['Normal', 'Gingivitis', 'Periodontitis'])->nullable();
            $table->enum('periodontitis_severity', ['Early', 'Moderate', 'Severe'])->nullable();
            $table->enum('plaque_deposit', ['Light', 'Moderate', 'Heavy'])->nullable();
            $table->string('other_treatments')->nullable();

            // Recommended Treatment
            $table->text('recommended_treatment')->nullable();

            // Timestamps & Tracking
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('recorded_by');

            // Indexes
            $table->index('patient_id', 'idx_dental_patient_id');
            $table->index('school_dentist_id', 'idx_dental_dentist_id');
            $table->index('school_nurse_id', 'idx_dental_nurse_id');
            $table->index('recorded_by', 'idx_dental_recorded_by');

            // Foreign Keys
            $table->foreign('recorded_by', 'fk_dental_recorded_by')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('patient_id', 'fk_dental_patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->foreign('school_dentist_id', 'fk_dental_dentist_id')->references('staff_id')->on('clinic_staffs')->onDelete('cascade');
            $table->foreign('school_nurse_id', 'fk_dental_nurse_id')->references('staff_id')->on('clinic_staffs')->onDelete('cascade');
            $table->foreign('updated_by', 'fk_dental_updated_by')->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dental_records');
    }
};
