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
        Schema::create('non_personnel', function (Blueprint $table) {
            $table->id('non_personnel_id'); // Explicit primary key
            $table->string('affiliation', 100);
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
            
            // Foreign key to patients
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id')->references('patient_id')->on('patients')->cascadeOnDelete();
        
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('non_personnel');
    }
};
