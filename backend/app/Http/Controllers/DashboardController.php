<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Pelanggaran;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $siswas = Siswa::with('kelas')->get();
        $kelas = Kelas::all();

        // Data total siswa dan kelas
        $totalSiswa = $siswas->count();
        $totalKelas = $kelas->count();

        // Pie: laki-laki & perempuan
        $pie_data = [
            ['name' => 'Laki-laki', 'value' => $siswas->where('jenis_kelamin', 'L')->count()],
            ['name' => 'Perempuan', 'value' => $siswas->where('jenis_kelamin', 'P')->count()],
        ];

        // Bar: jumlah siswa per kelas & gender
        $bar_data = $siswas->groupBy(fn($s) => $s->kelas->nama ?? "Tidak Diketahui")
            ->map(fn($group, $namakelas) => [
                'nama_kelas' => $namakelas,
                'Laki-Laki' => $group->where('jenis_kelamin', 'L')->count(),
                'Perempuan' => $group->where('jenis_kelamin', 'P')->count(),
            ])->values();

        // Bar: jumlah siswa per tahun lahir
        $bar_data_birthyear = $siswas->groupBy(fn($s) => Carbon::parse($s->tanggal_lahir)->format('Y'))
            ->map(fn($group, $year) => [
                'year' => $year,
                'count' => $group->count(),
            ])->values();

        // ------------------------------
        // DATA PELANGGARAN
        // ------------------------------
        $pelanggaran = Pelanggaran::with('siswa.kelas')->get();
        $totalPelanggaran = $pelanggaran->count();

        // ✅ Tren 6 bulan terakhir (per status)
        $now = Carbon::now();
        $months = collect(range(0, 5))
            ->map(fn($i) => $now->copy()->subMonths($i)->format('Y-m'))
            ->reverse()
            ->values();

        // Filter hanya pelanggaran yang tanggalnya termasuk 6 bulan terakhir
        $pelanggaran6bulan = $pelanggaran->filter(function($p) use ($months) {
            $bulan = Carbon::parse($p->tanggal)->format('Y-m');
            return $months->contains($bulan);
        });

        // Group by: bulan|status
        $grouped = $pelanggaran6bulan->groupBy(function($p) {
            return Carbon::parse($p->tanggal)->format('Y-m') . '|' . $p->status;
        });

        // Bentuk data tren
        $pelanggaranTren = $months->map(function($month) use ($grouped) {
            return [
                'bulan' => $month,
                'Aktif' => $grouped->get($month . '|Aktif', collect())->count(),
                'Selesai' => $grouped->get($month . '|Selesai', collect())->count(),
            ];
        });

        // ✅ Total per jenis pelanggaran
        $pelanggaranPerJenis = $pelanggaran
            ->groupBy('jenis_pelanggaran')
            ->map(fn($group, $jenis) => [
                'jenis_pelanggaran' => $jenis,
                'total' => $group->count(),
            ])->values();

        // ✅ Total per tingkat
        $pelanggaranPerTingkat = $pelanggaran
            ->groupBy('tingkat')
            ->map(fn($group, $tingkat) => [
                'tingkat' => $tingkat,
                'total' => $group->count(),
            ])->values();

        // ✅ Total pelanggaran per kelas (urut terbanyak)
        $pelanggaranPerKelas = $pelanggaran
            ->groupBy(fn($p) => $p->siswa->kelas->nama ?? 'Tidak Diketahui')
            ->map(fn($group, $kelas) => [
                'kelas' => $kelas,
                'total' => $group->count(),
            ])
            ->sortByDesc('total')
            ->values();

        return response()->json([
            // Data siswa
            'totalSiswa' => $totalSiswa,
            'totalKelas' => $totalKelas,
            'pie_data' => $pie_data,
            'bar_data' => $bar_data,
            'bar_data_birthyear' => $bar_data_birthyear,

            // Data pelanggaran
            'totalPelanggaran' => $totalPelanggaran,
            'pelanggaranTren' => $pelanggaranTren,
            'pelanggaranPerJenis' => $pelanggaranPerJenis,
            'pelanggaranPerTingkat' => $pelanggaranPerTingkat,
            'pelanggaranPerKelas' => $pelanggaranPerKelas,
        ]);
    }
}
