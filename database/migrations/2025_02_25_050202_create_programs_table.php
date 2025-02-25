<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id('program_id');
            $table->string('description', 70)->nullable();
            $table->string('program_code', 10)->nullable();
            $table->string('section_code', 45)->nullable();
            $table->unsignedTinyInteger('college_id'); // Reference to colleges
            $table->unsignedInteger('p_id');
            $table->tinyInteger('type')->comment('0 = College, 1 = Technical Vocational, 2 = Senior High School');
            $table->boolean('is_active');
            $table->boolean('is_board')->default(false);

            // Foreign key constraint
            $table->foreign('college_id')->references('college_id')->on('colleges')->onDelete('cascade');

            // Indexes
            $table->index(['program_id', 'college_id'], 'idx_programs_program_id_college_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
};
