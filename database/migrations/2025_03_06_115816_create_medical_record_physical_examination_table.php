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
        Schema::create('medical_record_physical_examination', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id'); // FK Medical Record
            $table->unsignedBigInteger('physical_examination_id'); // FK Physical Examination
            $table->enum('result', ['Normal', 'Abnormal'])->nullable(); // Result
            $table->text('remarks')->nullable(); // Optional Remarks
            $table->timestamps();

            // 🔑 Foreign Keys
            $table->foreign('medical_record_id', 'fk_exam_medical_record')
                ->references('id')
                ->on('medical_records')
                ->onDelete('cascade');

            $table->foreign('physical_examination_id', 'fk_exam_physical')
                ->references('id')
                ->on('physical_examinations')
                ->onDelete('cascade');

            // 📌 Index for Performance
            $table->index(['medical_record_id', 'physical_examination_id'], 'idx_exam_pivot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_physical_examination');
    }
};
