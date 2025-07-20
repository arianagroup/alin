<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'alina',
            'email' => 'test@example.com',
        ]);

        // Seed tables and reservations data
        $this->call([
            AdminUserSeeder::class,
            TableSeeder::class,
            ReservationSeeder::class,
        ]);
    }
}
