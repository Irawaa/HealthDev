<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bp_forms', function (Blueprint $table) {
            $table->id(); // Form ID
            $table->unsignedBigInteger('patient_id');

            // Clinic Staff Information
            $table->unsignedSmallInteger('school_nurse_id'); // Nurse in charge
            $table->unsignedInteger('recorded_by'); // Who recorded it?

            // BP Status (as string)
            $table->string('status', 50)->nullable(); // Example: "Stable", "Requires Attention", "Emergency"

            // Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // Indexes
            $table->index('patient_id', 'idx_bp_patient_id');
            $table->index('recorded_by', 'idx_bp_recorded_by');

            // Foreign Keys
            $table->foreign('patient_id', 'fk_bp_patient')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_bp_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_bp_recorded_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_bp_updated_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bp_forms');
    }
};
