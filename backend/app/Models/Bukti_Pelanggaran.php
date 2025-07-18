<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bukti_Pelanggaran extends Model
{
    use HasFactory;

    protected $table = 'bukti__pelanggarans';

    protected $fillable = [
        'pelanggaran_id', 'tipe', 'url', 'nama', 'deskripsi', 'diunggah_oleh', 'waktu_unggah'
    ];

    public function pelanggaran() {
        return $this->belongsTo(Pelanggaran::class, 'pelanggaran_id', 'id');
    }
}
