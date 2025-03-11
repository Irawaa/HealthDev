<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bp_readings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bp_form_id');
            $table->date('date');
            $table->time('time');
            $table->string('blood_pressure', 10); // Example: "120/80"
            $table->boolean('has_signature')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Foreign Key
            $table->foreign('bp_form_id', 'fk_bp_readings_form')
                ->references('id')
                ->on('bp_forms')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bp_readings');
    }
};

