<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kelas>
 */
class KelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $kelas = $this->faker->randomElement(['X', 'XI', 'XII']);
        $jurusan = $this->faker->randomElement(['RPL', 'EI', 'OI', 'DPIB', 'BKP']);
        $angka = $this->faker->randomElement(['A', 'B', 'C']);

        return [
            'nama' => Str::upper("{$kelas} {$jurusan} {$angka}"),
        ];
    }
}

