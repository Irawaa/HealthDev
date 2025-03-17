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
        Schema::create('medical_certificates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // 🏥 Medical Certificate Fields
            $table->text('diagnosis')->nullable();

            // ✅ Boolean Flag for Medication Rest
            $table->boolean('advised_medication_rest_required')->default(false)
                ->comment('If true, the advised_medication_rest date should be filled.');

            // ✅ Date for Advised Rest (Only valid if advised_medication_rest_required = true)
            $table->date('advised_medication_rest')->nullable();

            $table->enum('purpose', ['Excuse Slip', 'Off School Duty', 'OJT', 'Sports', 'ROTC', 'Others'])->nullable();
            $table->string('purpose_other', 255)->nullable();

            // 🔍 Recommendation & Clearance Status (TinyInteger 0,1,2)
            $table->tinyInteger('recommendation')->nullable()
                ->comment('0: Return to Class, 1: Sent Home, 2: To Hospital of Choice');
            $table->tinyInteger('clearance_status')->nullable()
                ->comment('0: Physically fit, 1: Cleared with evaluation needed, 2: Not Cleared');

            $table->string('further_evaluation', 255)->nullable();
            $table->enum('not_cleared_for', ['All sports', 'Certain sports', 'Activity'])->nullable();
            $table->string('activity_specification', 255)->nullable();

            // 🏥 Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // 📌 Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // 🔍 Indexes
            $table->index('patient_id', 'idx_medical_certificate_patient_id');
            $table->index('recorded_by', 'idx_medical_certificate_recorded_by');

            // 🔗 Foreign Keys
            $table->foreign('patient_id', 'fk_medical_certificate_patient')
                ->references('patient_id')->on('patients')->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_medical_certificate_nurse')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_medical_certificate_physician')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_medical_certificate_recorded_by')
                ->references('user_id')->on('users')->onDelete('cascade');

            $table->foreign('updated_by', 'fk_medical_certificate_updated_by')
                ->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_certificates');
    }
};
