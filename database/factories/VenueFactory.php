<?php

namespace Database\Factories;

use App\Models\Venue;
use App\Models\Merchant;
use Illuminate\Database\Eloquent\Factories\Factory;

class VenueFactory extends Factory
{
    protected $model = Venue::class;

    public function definition(): array
    {
        return [
            'merchant_id' => Merchant::factory(),
            'name' => $this->faker->company . ' Futsal',
            'slug' => $this->faker->slug,
            'address' => $this->faker->address,
            'city' => $this->faker->city,
            'phone' => $this->faker->phoneNumber,
        ];
    }
}
