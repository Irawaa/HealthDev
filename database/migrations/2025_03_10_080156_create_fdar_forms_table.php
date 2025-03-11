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
        Schema::create('fdar_forms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // Vital Signs
            $table->decimal('weight', 5, 2);
            $table->decimal('height', 4, 2);
            $table->string('blood_pressure', 10);
            $table->smallInteger('cardiac_rate');
            $table->smallInteger('respiratory_rate');
            $table->decimal('temperature', 4, 1);

            // Optional Fields
            $table->decimal('oxygen_saturation', 4, 1)->nullable();
            $table->date('last_menstrual_period')->nullable();

            // FDAR Content (Focus removed)
            $table->text('data');
            $table->text('action');
            $table->text('response');

            // Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedInteger('recorded_by');

            // Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // Indexes
            $table->index('patient_id', 'idx_fdar_patient_id');
            $table->index('recorded_by', 'idx_fdar_recorded_by');

            // Foreign Keys
            $table->foreign('patient_id', 'fk_fdar_patient')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_fdar_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_fdar_recorded_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_fdar_updated_by')
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
        Schema::dropIfExists('fdar_forms');
    }
};
