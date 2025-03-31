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
        Schema::create('pre_participatory_physical_examination', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pre_participatory_id'); // FK Pre-Participatory
            $table->unsignedBigInteger('physical_examination_id'); // FK Physical Examination
            $table->enum('result', ['Normal', 'Abnormal'])->nullable(); // Exam Result
            $table->text('remarks')->nullable(); // Optional Remarks
            $table->timestamps();

            // 🔑 Foreign Keys
            $table->foreign('pre_participatory_id', 'fk_exam_pre_participatory')
                ->references('id')
                ->on('pre_participatories')
                ->onDelete('cascade');

                $table->foreign('physical_examination_id', 'fk_exam_physical_examination')
                ->references('id')
                ->on('physical_examinations')
                ->onDelete('cascade');            

            // 📌 Index for Performance
            $table->index(['pre_participatory_id', 'physical_examination_id'], 'idx_exam_pivot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_participatory_physical_examination');
    }
};
