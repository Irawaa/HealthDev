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
        Schema::create('patients', function (Blueprint $table) {
            $table->bigIncrements('patient_id'); // Auto-increment primary key
            $table->enum('type', ['student', 'employee', 'non_personnel']);
            $table->string('lname', 100)->nullable();
            $table->string('fname', 100)->nullable();
            $table->string('mname', 100)->nullable();
            $table->string('ext', 10)->nullable();
            $table->date('birthdate')->nullable();
            $table->boolean('gender'); // 1: Male, 0: Female
            $table->tinyInteger('civil_status')->nullable();
            $table->string('emailaddress', 200)->nullable();
            $table->string('mobile', 50)->nullable();
            $table->string('telephone', 50)->nullable();
            $table->enum('status', ['healthy', 'sick', 'under_treatment'])->default('healthy');
            $table->timestamps();
        
            // Ensure 'updated_by' matches the type in 'users'
            $table->unsignedInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('user_id')->on('users')->nullOnDelete();
        });         
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
