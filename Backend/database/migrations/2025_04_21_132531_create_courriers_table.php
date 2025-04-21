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
        Schema::create('courriers', function (Blueprint $table) {
            $table->id();
            $table->string("reference");
            $table->string("objet");
            $table->enum("type",["entrant","sortant","interne"]);
            $table->date("date_reception")->nullable();
            $table->date("date_envoi")->nullable();
            $table->string("expediteur")->nullable();
            $table->string("distinataire")->nullable();
            $table->string("fichier_path")->nullable();
            $table->enum("status",["en_attente","transféré", "archivé"])->default("en_attente");
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courriers');
    }
};
