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
        Schema::create('pre_participatories', function (Blueprint $table) {
            $table->id();

            // 🔗 Patient Foreign Key
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id', 'fk_pre_participatories_patient')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            // 🔗 Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // 🏅 Final Evaluation
            $table->tinyInteger('final_evaluation')->nullable()
                ->comment('0: Physically fit, 1: Cleared with evaluation needed, 2: Not Cleared');

            $table->string('further_evaluation', 255)->nullable();
            $table->enum('not_cleared_for', ['All sports', 'Certain sports', 'Activity'])->nullable();
            $table->string('activity_specification', 255)->nullable();

            // 📅 Timestamps
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // 📌 Indexes
            $table->index('patient_id', 'idx_pre_participatories_patient');
            $table->index('recorded_by', 'idx_pre_participatories_recorded_by');

            // 🔑 Foreign Keys
            $table->foreign('school_nurse_id', 'fk_pre_participatories_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_pre_participatories_physician')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_pre_participatories_recorded_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_pre_participatories_updated_by')
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
        Schema::dropIfExists('pre_participatories');
    }
};
