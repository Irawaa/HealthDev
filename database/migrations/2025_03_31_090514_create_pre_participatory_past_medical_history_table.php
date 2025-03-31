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
        Schema::create('pre_participatory_past_medical_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pre_participatory_id');
            $table->unsignedBigInteger('past_medical_history_id');
            $table->string('custom_condition')->nullable(); // ✅ For "Others"
            $table->timestamps(); // ✅ Tracks when records are added

            // ✅ Foreign Keys
            $table->foreign('pre_participatory_id', 'fk_pmh_pre_participatory')
                ->references('id')
                ->on('pre_participatories')
                ->onDelete('cascade');

            // ✅ RENAMED to avoid duplicate constraint
            $table->foreign('past_medical_history_id', 'fk_pmh_medical_history')
                ->references('id')
                ->on('past_medical_histories')
                ->onDelete('cascade');

            // ✅ Indexes for Performance
            $table->index('pre_participatory_id', 'idx_pmh_pre_participatory');
            $table->index('past_medical_history_id', 'idx_pmh_medical_history');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_participatory_past_medical_history');
    }
};
