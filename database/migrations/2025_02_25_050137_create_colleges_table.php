<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('colleges', function (Blueprint $table) {
            $table->tinyIncrements('college_id');
            $table->string('description', 70)->nullable();
            $table->string('college_code', 10)->nullable();
            $table->unsignedInteger('dean_id')->nullable();
            $table->unsignedInteger('secretary_id')->nullable();
            $table->boolean('is_active')->nullable();
        
            // Custom index names to prevent MySQL error
            $table->index(['college_id', 'description', 'college_code', 'dean_id', 'secretary_id', 'is_active'], 'idx_colleges_main');
            $table->index(['dean_id', 'is_active'], 'idx_colleges_dean_id_is_active');
            $table->index(['college_id'], 'idx_colleges_college_id');
        });        
    }

    public function down()
    {
        Schema::dropIfExists('colleges');
    }
};
