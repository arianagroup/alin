<?php
// app/Http/Controllers/AdminDashboardController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // ✅ Ambil data pelanggan (users dengan role 'pelanggan')
        $customers = User::where('role', 'pelanggan')
            ->select([
                'id',
                'name',
                'email',
                'created_at',
                'email_verified_at'
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                // ✅ Perbaiki perhitungan hari - gunakan floor() untuk integer
                $createdAt = Carbon::parse($user->created_at);
                $now = Carbon::now();
                $daysSince = floor($createdAt->diffInDays($now)); // ✅ Floor untuk integer

                return [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'createdAt' => $user->created_at->toISOString(),
                    'emailVerifiedAt' => $user->email_verified_at?->toISOString(),
                    'isEmailVerified' => !is_null($user->email_verified_at),
                    'registrationDate' => $user->created_at->format('Y-m-d'),
                    'daysSinceRegistration' => (int) $daysSince, // ✅ Cast ke integer
                ];
            });

        // ✅ Debug log untuk melihat data
        \Log::info('Customers data with fixed days calculation:', $customers->toArray());

        // ✅ Ambil data reservations untuk dashboard
        $reservations = Reservation::latest()
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => (string) $reservation->id,
                    'customerName' => $reservation->customerName,
                    'customerPhone' => $reservation->customerPhone,
                    'customerEmail' => $reservation->customerEmail,
                    'date' => $reservation->date->format('Y-m-d'),
                    'time' => $reservation->time->format('H:i'),
                    'duration' => $reservation->duration,
                    'guests' => $reservation->guests,
                    'tableId' => (string) $reservation->tableId,
                    'status' => $reservation->status,
                    'specialRequests' => $reservation->specialRequests,
                    'notes' => $reservation->notes,
                    'createdAt' => $reservation->created_at->toISOString(),
                ];
            });

        // ✅ Ambil data tables
        $tables = Table::all()->map(function ($table) {
            return [
                'id' => (string) $table->id,
                'number' => $table->number,
                'capacity' => $table->capacity,
                'location' => $table->location,
                'status' => $table->status,
            ];
        });

        return Inertia::render('admin/Home', [
            'customers' => $customers,
            'reservations' => $reservations,
            'tables' => $tables,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function getCustomersData()
    {
        // ✅ API endpoint untuk refresh data customers
        $customers = User::where('role', 'pelanggan')
            ->select(['id', 'name', 'email', 'created_at', 'email_verified_at'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                // ✅ Perbaiki perhitungan hari - gunakan floor() untuk integer
                $createdAt = Carbon::parse($user->created_at);
                $now = Carbon::now();
                $daysSince = floor($createdAt->diffInDays($now)); // ✅ Floor untuk integer

                return [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'createdAt' => $user->created_at->toISOString(),
                    'emailVerifiedAt' => $user->email_verified_at?->toISOString(),
                    'isEmailVerified' => !is_null($user->email_verified_at),
                    'registrationDate' => $user->created_at->format('Y-m-d'),
                    'daysSinceRegistration' => (int) $daysSince, // ✅ Cast ke integer
                ];
            });

        return response()->json($customers);
    }
}
