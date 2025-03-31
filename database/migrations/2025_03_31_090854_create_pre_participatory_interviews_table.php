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
        Schema::create('pre_participatory_interviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pre_participatory_id');
            $table->unsignedBigInteger('question_id');
            $table->enum('response', ['Yes', 'No']); // ✅ Stores Yes/No answer
            $table->string('remarks')->nullable(); // ✅ Optional remarks
            $table->timestamps();

            // ✅ Foreign Keys
            $table->foreign('pre_participatory_id', 'fk_interview_pre_participatory')
                ->references('id')
                ->on('pre_participatories')
                ->onDelete('cascade');

            $table->foreign('question_id', 'fk_interview_question')
                ->references('id')
                ->on('pre_participatory_questions')
                ->onDelete('cascade');

            // ✅ Indexes for Performance
            $table->index('pre_participatory_id', 'idx_interview_pre_participatory');
            $table->index('question_id', 'idx_interview_question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_participatory_interviews');
    }
};
