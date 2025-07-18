<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Siswa>
 */
class SiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nisn = $this->faker->unique()->numerify('####-####-####');
        $nama = $this->faker->name();
        $jenis_kelamin = $this->faker->randomElement(['L', 'P']);
        $kelas_id = $this->faker->numberBetween(1, 30);
        $tanggal_lahir = $this->faker->dateTimeBetween('-25 years', '-10 years');
        $alamat = $this->faker->address();

        return [
            'nis' => $nisn,
            'nama' => $nama,
            'jenis_kelamin' => $jenis_kelamin,
            'kelas_id' => $kelas_id,
            'tanggal_lahir' => $tanggal_lahir,
            'alamat' => $alamat,
        ];
    }
}

