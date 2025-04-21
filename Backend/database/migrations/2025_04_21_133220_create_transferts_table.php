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
        Schema::create('transferts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('courrier_id')->constrained('courriers')->onDelete('cascade');
            $table->foreignId('from_division_id')->constrained('divisions');
            $table->foreignId('to_division_id')->constrained('divisions');
            $table->text('remarque')->nullable();
            $table->timestamp('date_transfert')->useCurrent();
            $table->foreignId('transferred_by')->constrained('users');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferts');
    }
};
