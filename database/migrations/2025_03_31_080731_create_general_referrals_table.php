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
        Schema::create('general_referrals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');

            // ✅ Referral Details
            $table->string('to'); // Recipient Name
            $table->string('address')->nullable(); // Recipient Address
            $table->date('examined_on'); // Date of Examination
            $table->string('examined_due_to'); // Reason for Examination
            $table->unsignedSmallInteger('duration'); // Duration in Days
            $table->string('impression'); // Impression / Diagnosis

            // ✅ Clinic Staff Foreign Keys
            $table->unsignedSmallInteger('school_nurse_id');
            $table->unsignedSmallInteger('school_physician_id');
            $table->unsignedInteger('recorded_by');

            // 📌 Tracking Information
            $table->timestamps();
            $table->unsignedInteger('updated_by')->nullable();

            // 🔍 Indexes
            $table->index('patient_id', 'idx_gen_ref_patient_id');
            $table->index('recorded_by', 'idx_gen_ref_recorded_by');

            // 🔗 Foreign Keys
            $table->foreign('patient_id', 'fk_gen_ref_patient')
                ->references('patient_id')->on('patients')->onDelete('cascade');

            $table->foreign('school_nurse_id', 'fk_gen_ref_nurse')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('school_physician_id', 'fk_gen_ref_physician')
                ->references('staff_id')->on('clinic_staffs')->onDelete('cascade');

            $table->foreign('recorded_by', 'fk_gen_ref_recorded_by')
                ->references('user_id')->on('users')->onDelete('cascade');

            $table->foreign('updated_by', 'fk_gen_ref_updated_by')
                ->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_referrals');
    }
};
