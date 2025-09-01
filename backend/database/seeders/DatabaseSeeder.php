<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Pelanggaran;
use App\Models\Bukti_Pelanggaran;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Kelas::factory(30)->create();
        Siswa::factory(1000)->create();
        Pelanggaran::factory(100)->create();
        Bukti_Pelanggaran::factory(100)->create();
    }
}
