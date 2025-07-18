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
        Schema::create('bukti__pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelanggaran_id')->constrained('pelanggarans')->onDelete('cascade');
            $table->string('tipe');
            $table->string('url');
            $table->string('nama')->nullable();
            $table->string('deskripsi')->nullable();
            $table->string('diunggah_oleh');
            $table->dateTime('waktu_unggah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bukti__pelanggarans');
    }
};
