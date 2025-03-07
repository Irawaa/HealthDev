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
        Schema::create('medical_record_family_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id'); // FK to Medical Record
            $table->unsignedBigInteger('family_history_id'); // FK to Family History
            $table->string('family_member'); // Immediate Family Only
            $table->text('family_history_remarks')->nullable(); // Remarks for Family Member
            $table->text('overall_remarks')->nullable(); // General Remarks for the Condition
            $table->timestamps();

            // 🔑 Foreign Keys
            $table->foreign('medical_record_id', 'fk_family_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            $table->foreign('family_history_id', 'fk_family_history')
                ->references('id')
                ->on('family_histories')
                ->onDelete('cascade');

            // 📌 Index for Performance
            $table->index(['medical_record_id', 'family_history_id'], 'idx_family_history_pivot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_family_history');
    }
};

