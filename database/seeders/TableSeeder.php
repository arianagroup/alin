<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = [
            ['number' => 1, 'capacity' => 2, 'location' => 'Window', 'status' => 'available'],
            ['number' => 2, 'capacity' => 4, 'location' => 'Center', 'status' => 'occupied'],
            ['number' => 3, 'capacity' => 6, 'location' => 'Corner', 'status' => 'reserved'],
            ['number' => 4, 'capacity' => 8, 'location' => 'Private', 'status' => 'maintenance'],
            ['number' => 5, 'capacity' => 4, 'location' => 'Bar', 'status' => 'available'],
            ['number' => 6, 'capacity' => 2, 'location' => 'Terrace', 'status' => 'available'],
            ['number' => 7, 'capacity' => 6, 'location' => 'Garden', 'status' => 'occupied'],
            ['number' => 8, 'capacity' => 10, 'location' => 'VIP', 'status' => 'available'],
            ['number' => 9, 'capacity' => 4, 'location' => 'Balcony', 'status' => 'available'],
            ['number' => 10, 'capacity' => 8, 'location' => 'Main Hall', 'status' => 'reserved'],
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}