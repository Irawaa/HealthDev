<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id('dept_id');
            $table->string('name', 100)->nullable();
            $table->string('acronym', 20)->nullable();
            $table->string('division', 5)->nullable();
            $table->tinyInteger('level')->default(0);
            $table->boolean('is_college')->default(false);
            $table->unsignedInteger('dept_head');
            $table->boolean('is_active')->default(true);
        });
    }

    public function down()
    {
        Schema::dropIfExists('departments');
    }
};
