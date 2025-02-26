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
        Schema::create('students', function (Blueprint $table) {
            $table->string('stud_id', 10)->primary();
            $table->unsignedInteger('curr_id')->nullable();
            $table->unsignedInteger('year_id')->default(0);
            $table->boolean('is_vaccinated')->nullable();
            $table->string('father_name', 200);
            $table->boolean('father_gender')->default(1);
            $table->date('father_birthdate')->nullable();
            $table->string('father_occupation', 255);
            $table->string('mother_name', 200);
            $table->boolean('mother_gender')->default(0);
            $table->date('mother_birthdate')->nullable();
            $table->string('mother_occupation', 255);
            $table->string('guardian_name', 200);
            $table->string('guardian_relation', 50);
            $table->string('guardian_contactno', 20);
            $table->text('address_house')->nullable();
            $table->string('address_brgy', 100)->nullable();
            $table->string('address_citytown', 100)->nullable();
            $table->string('address_province', 100)->nullable();
            $table->unsignedInteger('address_zipcode')->nullable();
            $table->string('emergency_contact_name', 200)->nullable();
            $table->string('emergency_contact_no', 20)->nullable();
            $table->unsignedTinyInteger('college_id')->nullable(); // College reference
            $table->unsignedBigInteger('program_id')->nullable(); // Program reference
            
            // Correct foreign key reference
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id')->references('patient_id')->on('patients')->cascadeOnDelete();
            $table->foreign('college_id')->references('college_id')->on('colleges')->nullOnDelete();
            $table->foreign('program_id')->references('program_id')->on('programs')->nullOnDelete();
        
            $table->timestamps();
        });         
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
