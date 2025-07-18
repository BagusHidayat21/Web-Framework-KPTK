<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Bukti_Pelanggaran;

class Pelanggaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id', 'dilaporkan_oleh', 'jenis_pelanggaran', 'tingkat', 'poin',
        'tanggal', 'waktu', 'lokasi', 'deskripsi', 'status',
        'tindakan', 'tanggal_tindak_lanjut', 'catatan'
    ];

    public function siswa() {
        return $this->belongsTo(Siswa::class);
    }

    public function pelapor() {
        return $this->belongsTo(User::class, 'dilaporkan_oleh');
    }

    public function bukti() {
        return $this->hasMany(Bukti_Pelanggaran::class, 'pelanggaran_id', 'id');
    }
}
