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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("num")->nullable()->unique();
            $table->string("ref");
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('from_division_id')->constrained('devisions')->onDelete('cascade');
            $table->foreignId('to_division_id')->constrained('devisions')->onDelete('cascade');
            $table->string("objet");
            $table->enum("type",["entrant","sortant"]);
            $table->date("date_reception")->nullable();
            $table->date("date_envoi")->nullable();
            $table->string("expediteur")->nullable();
            $table->string("destinataire")->nullable();
            $table->string("fichier_path")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
