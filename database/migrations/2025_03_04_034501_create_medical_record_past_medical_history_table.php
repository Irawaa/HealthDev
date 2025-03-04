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
        Schema::create('medical_record_past_medical_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->unsignedBigInteger('past_medical_history_id');
            $table->string('custom_condition')->nullable(); // ✅ For "Others"
            $table->timestamps(); // ✅ Tracks when records are added

            // ✅ Foreign Keys
            $table->foreign('medical_record_id', 'fk_pmh_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            $table->foreign('past_medical_history_id', 'fk_pmh_condition')
                ->references('id')
                ->on('past_medical_histories')
                ->onDelete('cascade');

            // ✅ Indexes for Performance
            $table->index('medical_record_id', 'idx_pmh_medical_record');
            $table->index('past_medical_history_id', 'idx_pmh_condition');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_past_medical_history');
    }
};
