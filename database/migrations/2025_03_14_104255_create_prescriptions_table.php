<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');

            // Store the prescription image as a BLOB
            // $table->binary('prescription_image')->nullable();
            $table->string('prescription_image')->nullable();
            $table->unsignedBigInteger('prescription_number')->unique()->nullable();

            // Tracking information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('recorded_by');

            // Indexes
            $table->index('patient_id', 'idx_prescription_patient_id');
            $table->index('school_nurse_id', 'idx_prescription_nurse_id');
            $table->index('school_physician_id', 'idx_prescription_physician_id');
            $table->index('recorded_by', 'idx_incident_recorded_by');

            // Foreign Keys
            $table->foreign('patient_id', 'fk_prescription_patient')
                ->references('patient_id')
                ->on('patients')
                ->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_prescription_nurse')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_prescription_physician')
                ->references('staff_id')
                ->on('clinic_staffs')
                ->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_prescription_recorded_by')
                ->references('user_id') // ✅ Corrected reference to `users`
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('updated_by', 'fk_prescription_updated_by')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null');
        });

        // Modify column type for prescription_image
        DB::statement("ALTER TABLE prescriptions MODIFY prescription_image MEDIUMBLOB NULL");
    }

    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
