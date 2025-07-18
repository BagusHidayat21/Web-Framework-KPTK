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
        Schema::create('pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('dilaporkan_oleh')->constrained('users')->onDelete('cascade');
            $table->string('jenis_pelanggaran');
            $table->string('tingkat');
            $table->integer('poin');
            $table->date('tanggal');
            $table->time('waktu');
            $table->string('lokasi');
            $table->text('deskripsi');
            $table->string('status')->default('Aktif');
            $table->text('tindakan')->nullable();
            $table->date('tanggal_tindak_lanjut')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggarans');
    }
};
