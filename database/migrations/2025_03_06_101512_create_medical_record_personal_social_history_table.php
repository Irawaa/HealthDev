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
        Schema::create('medical_record_personal_social_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');

            // ✅ Alcoholic Drinker
            $table->enum('alcoholic_drinker', ['Regular', 'Occasional', 'No'])->nullable();

            // ✅ Smoker
            $table->boolean('smoker')->nullable(); // Smoker Checkbox
            $table->smallInteger('sticks_per_day')->nullable(); // Sticks per Day
            $table->smallInteger('years_smoking')->nullable(); // Years of Smoking

            // ✅ Illicit Drugs
            $table->boolean('illicit_drugs')->nullable(); // Use of Illicit Drugs

            // ✅ Eye Disorder
            $table->boolean('eye_glasses')->nullable(); // Eye Glasses
            $table->boolean('contact_lens')->nullable(); // Contact Lens
            $table->boolean('eye_disorder_no')->nullable(); // No Eye Disorder

            $table->timestamps();

            // Foreign Key
            $table->foreign('medical_record_id', 'fk_personal_social_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            // Index for performance
            $table->index('medical_record_id', 'idx_personal_social_medical_record');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_personal_social_history');
    }
};
