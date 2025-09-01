<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pelanggaran>
 */
class PelanggaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'siswa_id' => \App\Models\Siswa::factory(),
            'dilaporkan_oleh' => \App\Models\User::factory(),
            'jenis_pelanggaran' => $this->faker->randomElement(['Terlambat', 'Tidak memakai seragam', 'Merokok', 'Bolos']),
            'tingkat' => $this->faker->randomElement(['Ringan', 'Sedang', 'Berat']),
            'poin' => $this->faker->numberBetween(5, 100),
            'tanggal' => $this->faker->date(),
            'waktu' => $this->faker->time(),
            'lokasi' => $this->faker->randomElement(['Kelas', 'Kantin', 'Lapangan', 'Gerbang']),
            'deskripsi' => $this->faker->sentence(10),
            'status' => $this->faker->randomElement(['Aktif', 'Selesai']),
            'tindakan' => $this->faker->optional()->sentence(8),
            'tanggal_tindak_lanjut' => $this->faker->optional()->date(),
            'catatan' => $this->faker->optional()->paragraph(),
        ];
    }
}
