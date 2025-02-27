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
        Schema::create('employees', function (Blueprint $table) {
            $table->id('employee_id'); // Explicit primary key
            $table->string('employee_no', 255)->nullable();
            $table->date('date_hired')->nullable();
            $table->boolean('is_active')->nullable();
            $table->double('height')->nullable();
            $table->double('weight')->nullable();
            $table->string('blood_type', 5)->nullable();
            $table->string('father_name', 200)->nullable();
            $table->string('mother_name', 200)->nullable();
            $table->string('spouse_name', 200)->nullable();
            $table->string('spouse_occupation', 100)->nullable();
            $table->string('emergency_contact_person', 200)->nullable();
            $table->string('emergency_contact_number', 20)->nullable();
            $table->string('res_brgy', 45)->nullable();
            $table->string('res_city', 45)->nullable();
            $table->string('res_prov', 45)->nullable();
            $table->unsignedInteger('res_region')->nullable();
            $table->string('res_zipcode', 10)->nullable();
            $table->unsignedBigInteger('dept_id')->nullable(); // Department reference
            $table->unsignedTinyInteger('college_id')->nullable(); // College reference (if applicable)


            // Foreign key to patients
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id')->references('patient_id')->on('patients')->cascadeOnDelete();
            $table->foreign('dept_id')->references('dept_id')->on('departments')->nullOnDelete();
            $table->foreign('college_id')->references('college_id')->on('colleges')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
