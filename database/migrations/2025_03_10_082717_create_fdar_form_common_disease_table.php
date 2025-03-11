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
        Schema::create('fdar_form_common_disease', function (Blueprint $table) {
            $table->unsignedBigInteger('fdar_form_id');
            $table->unsignedBigInteger('common_disease_id');

            // Timestamps
            $table->timestamps();

            // Foreign Keys
            $table->foreign('fdar_form_id')->references('id')->on('fdar_forms')->onDelete('cascade');
            $table->foreign('common_disease_id')->references('id')->on('common_diseases')->onDelete('cascade');

            // Composite Primary Key
            $table->primary(['fdar_form_id', 'common_disease_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fdar_form_common_disease');
    }
};
