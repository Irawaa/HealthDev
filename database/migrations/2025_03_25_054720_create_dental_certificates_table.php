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
        Schema::create('dental_certificates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // 🦷 Dental Procedures (Checkboxes)
            $table->boolean('mouth_examination')->default(false);
            $table->boolean('gum_treatment')->default(false);
            $table->boolean('oral_prophylaxis')->default(false);
            $table->boolean('extraction')->default(false);

            // 💬 Remarks
            $table->text('remarks')->nullable();

            // 🏥 School Dentist Foreign Key
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_dentist_id')->nullable();
            $table->unsignedInteger('recorded_by');

            // 📅 Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // 🔍 Indexes
            $table->index('patient_id', 'idx_dental_certificates_patient_id');
            $table->index('recorded_by', 'idx_dental_certificates_recorded_by');

            // 🔗 Foreign Keys
            $table->foreign('patient_id', 'fk_dental_certificates_patient')
                ->references('patient_id')->on('patients')->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_dental_certificate_nurse')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('school_dentist_id', 'fk_dental_certificates_dentist')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_dental_certificates_recorded_by')
                ->references('user_id')->on('users')->onDelete('cascade');

            $table->foreign('updated_by', 'fk_dental_certificates_updated_by')
                ->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dental_certificates');
    }
};
