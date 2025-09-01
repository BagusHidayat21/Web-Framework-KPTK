<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bukti_Pelanggaran>
 */
class Bukti_PelanggaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pelanggaran_id' => $this->faker->numberBetween(1, 100),
            'tipe' => $this->faker->word(),
            'url' => $this->faker->url(),
            'nama' => $this->faker->optional()->word(),
            'deskripsi' => $this->faker->optional()->sentence(),
            'diunggah_oleh' => $this->faker->name(),
            'waktu_unggah' => $this->faker->dateTime(),
        ];
    }
}
