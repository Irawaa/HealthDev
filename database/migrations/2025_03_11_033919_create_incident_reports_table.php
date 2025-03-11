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
        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // Incident Details
            $table->text('history');
            $table->string('nature_of_incident', 255);
            $table->string('place_of_incident', 255);
            $table->date('date_of_incident');
            $table->time('time_of_incident');
            $table->text('description_of_injury')->nullable();

            // Management Options
            $table->enum('management', ['In PNC', 'Referred to Hospital']);
            $table->string('hospital_specification', 255)->nullable(); // If referred to hospital

            // Clinic Staff Foreign Keys (Updated data types)
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // Indexes
            $table->index('patient_id', 'idx_incident_patient_id');
            $table->index('recorded_by', 'idx_incident_recorded_by');

            // Foreign Keys
            $table->foreign('patient_id', 'fk_incident_patient')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_incident_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_incident_physician')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_incident_recorded_by')
                ->references('user_id') // ✅ Corrected reference to `users`
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_incident_updated_by')
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
        Schema::dropIfExists('incident_reports');
    }
};
