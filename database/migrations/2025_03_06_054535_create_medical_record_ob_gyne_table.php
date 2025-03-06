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
        Schema::create('medical_record_ob_gyne_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->enum('menstruation', ['Regular', 'Irregular'])->nullable(); // Menstruation Cycle
            $table->enum('duration', ['1-3 days', '4-6 days', '7-9 days'])->nullable(); // Duration of Menstruation
            $table->boolean('dysmenorrhea')->nullable(); // Dysmenorrhea
            $table->boolean('pregnant_before')->nullable(); // History of Pregnancy
            $table->smallInteger('num_of_pregnancies')->nullable(); // Number of Pregnancies
            $table->date('last_menstrual_period')->nullable(); // Last Menstrual Period
            $table->timestamps();

            // Foreign Key
            $table->foreign('medical_record_id', 'fk_obgyne_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            // Index for performance
            $table->index('medical_record_id', 'idx_obgyne_medical_record');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_ob_gyne_history');
    }
};
