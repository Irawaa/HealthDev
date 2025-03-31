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
        Schema::create('laboratory_exam_referrals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // ✅ Standard Laboratory Tests (Boolean Flags)
            $table->boolean('x_ray')->default(false);
            $table->boolean('cbc')->default(false);
            $table->boolean('urinalysis')->default(false);
            $table->boolean('fecalysis')->default(false);
            $table->boolean('physical_examination')->default(false);
            $table->boolean('dental')->default(false);
            $table->boolean('hepatitis_b_screening')->default(false);
            $table->boolean('pregnancy_test')->default(false);
            $table->boolean('drug_test')->default(false);

            // ✅ Magic 8 Test (Main Selection)
            $table->boolean('magic_8')->default(false);

            // ✅ Magic 8 Sub-Tests (Enabled only if Magic 8 is selected)
            $table->boolean('fbs')->default(false);
            $table->boolean('lipid_profile')->default(false);
            $table->boolean('bun')->default(false);
            $table->boolean('bua')->default(false);
            $table->boolean('creatine')->default(false);
            $table->boolean('sgpt')->default(false);
            $table->boolean('sgot')->default(false);

            // ✅ Others Field (Custom Test Input)
            $table->string('others')->nullable();

            // ✅ Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // 📌 Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // 🔍 Indexes
            $table->index('patient_id', 'idx_lab_exam_patient_id');
            $table->index('recorded_by', 'idx_lab_exam_recorded_by');

            // 🔗 Foreign Keys
            $table->foreign('patient_id', 'fk_lab_exam_patient')
                ->references('patient_id')->on('patients')->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_lab_exam_nurse')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_lab_exam_physician')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_lab_exam_recorded_by')
                ->references('user_id')->on('users')->onDelete('cascade');

            $table->foreign('updated_by', 'fk_lab_exam_updated_by')
                ->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratory_exam_referrals');
    }
};
