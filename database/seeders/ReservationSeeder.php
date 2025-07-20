<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();
        
        $reservations = [
            [
                'customerName' => 'John Doe',
                'customerPhone' => '+62812345678',
                'customerEmail' => 'john@email.com',
                'date' => $today->format('Y-m-d'),
                'time' => '19:00',
                'duration' => 120,
                'guests' => 4,
                'tableId' => 2,
                'status' => 'confirmed',
                'specialRequests' => 'Birthday celebration',
                'notes' => 'Regular customer'
            ],
            [
                'customerName' => 'Jane Smith',
                'customerPhone' => '+62887654321',
                'customerEmail' => 'jane@email.com',
                'date' => $today->format('Y-m-d'),
                'time' => '20:30',
                'duration' => 90,
                'guests' => 2,
                'tableId' => 1,
                'status' => 'pending',
                'specialRequests' => 'Vegetarian menu',
                'notes' => ''
            ],
            [
                'customerName' => 'Bob Wilson',
                'customerPhone' => '+62856789012',
                'customerEmail' => 'bob@email.com',
                'date' => $today->format('Y-m-d'),
                'time' => '18:00',
                'duration' => 150,
                'guests' => 6,
                'tableId' => 3,
                'status' => 'seated',
                'specialRequests' => 'Business dinner',
                'notes' => 'VIP customer'
            ],
            [
                'customerName' => 'Alice Brown',
                'customerPhone' => '+62823456789',
                'customerEmail' => 'alice@email.com',
                'date' => $tomorrow->format('Y-m-d'),
                'time' => '19:30',
                'duration' => 120,
                'guests' => 3,
                'tableId' => 5,
                'status' => 'confirmed',
                'specialRequests' => 'Anniversary dinner',
                'notes' => 'Prefers quiet table'
            ],
            [
                'customerName' => 'Charlie Davis',
                'customerPhone' => '+62834567890',
                'customerEmail' => 'charlie@email.com',
                'date' => $tomorrow->format('Y-m-d'),
                'time' => '20:00',
                'duration' => 180,
                'guests' => 8,
                'tableId' => 8,
                'status' => 'pending',
                'specialRequests' => 'Group celebration',
                'notes' => 'Large party'
            ]
        ];

        foreach ($reservations as $reservation) {
            Reservation::create($reservation);
        }
    }
}