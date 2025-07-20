<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    /**
     * Get all reservations
     */
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with('table');

        // Filter by date if provided
        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $reservations = $query->orderBy('date')->orderBy('time')->get();

        // Format the response
        $formattedReservations = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'customerName' => $reservation->customerName,
                'customerPhone' => $reservation->customerPhone,
                'customerEmail' => $reservation->customerEmail,
                'date' => $reservation->date->format('Y-m-d'),
                'time' => $reservation->time->format('H:i'),
                'duration' => $reservation->duration,
                'guests' => $reservation->guests,
                'tableId' => $reservation->tableId,
                'status' => $reservation->status,
                'specialRequests' => $reservation->specialRequests,
                'notes' => $reservation->notes,
                'created_at' => $reservation->created_at,
                'table' => $reservation->table
            ];
        });

        return response()->json($formattedReservations);
    }

    /**
     * Store a new reservation
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customerName' => 'required|string|max:255',
            'customerPhone' => 'required|string|max:20',
            'customerEmail' => 'required|email|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30|max:480',
            'guests' => 'required|integer|min:1|max:20',
            'tableId' => 'required|exists:tables,id',
            'specialRequests' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        // Jika pengguna sudah login, gunakan email pengguna yang login
        if (Auth::check()) {
            $validated['customerEmail'] = Auth::user()->email;
        }

        // Use database transaction for atomicity
        return DB::transaction(function () use ($validated) {
            // Check if table is available at the requested time
            $table = Table::lockForUpdate()->find($validated['tableId']);
            if (!$table || $table->isUnderMaintenance()) {
                return response()->json([
                    'message' => 'Table is not available'
                ], 422);
            }

            // Check for conflicting reservations
            $conflictingReservation = $this->hasConflictingReservation($validated);
            if ($conflictingReservation) {
                return response()->json([
                    'message' => 'Meja sudah dipesan untuk waktu tersebut. Silakan pilih waktu atau meja lain.'
                ], 422);
            }

            // Create reservation
            $reservation = Reservation::create($validated);

            // Update table status only if reservation is for today and within active hours
            $this->updateTableStatusAfterReservation($table, $validated['date'], $validated['time']);

            \Log::info("Reservation created for table {$table->number}", [
                'reservation_id' => $reservation->id,
                'date' => $validated['date'],
                'time' => $validated['time']
            ]);

            return response()->json($reservation->load('table'), 201);
        });
    }

    /**
     * Update a reservation
     */
    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'customerName' => 'required|string|max:255',
            'customerPhone' => 'required|string|max:20',
            'customerEmail' => 'required|email|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30|max:480',
            'guests' => 'required|integer|min:1|max:20',
            'tableId' => 'required|exists:tables,id',
            'specialRequests' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated, $reservation) {
            $oldTableId = $reservation->tableId;
            $reservation->update($validated);

            // If table changed, update both old and new table statuses
            if ($oldTableId != $validated['tableId']) {
                // Update old table status
                $oldTable = Table::find($oldTableId);
                if ($oldTable) {
                    $this->syncSingleTableStatus($oldTable, $reservation->date->format('Y-m-d'));
                }

                // Update new table status
                $newTable = Table::find($validated['tableId']);
                if ($newTable) {
                    $this->updateTableStatusAfterReservation($newTable, $validated['date'], $validated['time']);
                }
            }

            return response()->json($reservation->load('table'));
        });
    }

    /**
     * Delete a reservation
     */
    public function destroy(Reservation $reservation): JsonResponse
    {
        return DB::transaction(function () use ($reservation) {
            $table = $reservation->table;
            $reservationDate = $reservation->date->format('Y-m-d');
            $reservation->delete();

            // Update table status if needed
            if ($table) {
                $this->syncSingleTableStatus($table, $reservationDate);
            }

            return response()->json(['message' => 'Reservation deleted successfully']);
        });
    }

    /**
     * Update reservation status
     */
    public function updateStatus(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,seated,completed,cancelled,no-show'
        ]);

        return DB::transaction(function () use ($validated, $reservation) {
            $oldStatus = $reservation->status;
            $newStatus = $validated['status'];

            $reservation->update($validated);

            // Update table status based on reservation status and timing
            $this->updateTableStatusBasedOnReservation($reservation, $oldStatus, $newStatus);

            \Log::info("Reservation status updated", [
                'reservation_id' => $reservation->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'table_id' => $reservation->tableId
            ]);

            return response()->json($reservation->load('table'));
        });
    }

    /**
     * Sync table statuses based on active reservations
     */
    public function syncTableStatuses(): JsonResponse
    {
        $today = now()->format('Y-m-d');
        $currentTime = now()->format('H:i:s');
        $syncedCount = 0;

        // Get all tables
        $tables = Table::all();

        foreach ($tables as $table) {
            if ($this->syncSingleTableStatus($table, $today, $currentTime)) {
                $syncedCount++;
            }
        }

        return response()->json([
            'message' => 'Table statuses synchronized successfully',
            'synced_count' => $syncedCount,
            'total_tables' => $tables->count()
        ]);
    }

    /**
     * Get reservations for the authenticated customer
     */
    public function customerReservations(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $reservations = Reservation::with('table')
            ->where('customerEmail', $user->email)
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'customerName' => $reservation->customerName,
                    'customerPhone' => $reservation->customerPhone,
                    'customerEmail' => $reservation->customerEmail,
                    'date' => $reservation->date->format('Y-m-d'),
                    'time' => $reservation->time->format('H:i'),
                    'duration' => $reservation->duration,
                    'guests' => $reservation->guests,
                    'tableId' => $reservation->tableId,
                    'status' => $reservation->status,
                    'specialRequests' => $reservation->specialRequests,
                    'notes' => $reservation->notes,
                    'createdAt' => $reservation->created_at->format('Y-m-d'),
                    'table' => $reservation->table ? [
                        'id' => $reservation->table->id,
                        'number' => $reservation->table->number,
                        'capacity' => $reservation->table->capacity,
                        'location' => $reservation->table->location,
                        'status' => $reservation->table->status
                    ] : null
                ];
            });

        return response()->json($reservations);
    }

    /**
     * Update reservation status by customer
     */
    public function updateCustomerStatus(Request $request, Reservation $reservation): JsonResponse
    {
        try {
            \Log::info('Updating customer reservation status', [
                'reservation_id' => $reservation->id,
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Unauthorized: No authenticated user'], 401);
            }

            if ($reservation->customerEmail !== $user->email) {
                return response()->json(['message' => 'Unauthorized: This reservation does not belong to you'], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:cancelled'
            ]);

            if ($validated['status'] !== 'cancelled') {
                return response()->json(['message' => 'Invalid status change'], 422);
            }

            // Check if reservation can be cancelled
            $reservationDateTime = $reservation->getReservationDateTime();
            if ($reservationDateTime->isPast() || in_array($reservation->status, ['completed', 'cancelled', 'no-show'])) {
                return response()->json(['message' => 'Reservation cannot be cancelled'], 422);
            }

            return DB::transaction(function () use ($reservation) {
                $reservation->update(['status' => 'cancelled']);
                \Log::info('Reservation cancelled successfully', ['reservation_id' => $reservation->id]);

                // Update table status if needed
                $table = $reservation->table;
                if ($table) {
                    $reservationDate = $reservation->date->format('Y-m-d');
                    $this->syncSingleTableStatus($table, $reservationDate);
                }

                return response()->json(['message' => 'Reservation cancelled successfully']);
            });

        } catch (\Exception $e) {
            \Log::error('Error cancelling reservation', [
                'reservation_id' => $reservation->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'An error occurred while cancelling the reservation'], 500);
        }
    }

    /**
     * Check if there's a conflicting reservation
     */
    private function hasConflictingReservation(array $validated): bool
    {
        return Reservation::where('tableId', $validated['tableId'])
            ->where('date', $validated['date'])
            ->active()
            ->where(function ($query) use ($validated) {
                $requestStart = $validated['time'];
                $requestEnd = Carbon::parse($validated['time'])->addMinutes($validated['duration'])->format('H:i');

                $query->whereRaw('(
                    (time <= ? AND ADDTIME(time, SEC_TO_TIME(duration * 60)) > ?) OR
                    (time < ? AND ADDTIME(time, SEC_TO_TIME(duration * 60)) >= ?) OR
                    (time >= ? AND time < ?)
                )', [$requestStart, $requestStart, $requestEnd, $requestEnd, $requestStart, $requestEnd]);
            })
            ->exists();
    }

    /**
     * Update table status after creating a reservation
     */
    private function updateTableStatusAfterReservation(Table $table, string $date, string $time): void
    {
        $reservationDateTime = Carbon::parse($date . ' ' . $time);
        $now = now();

        // Only update status if:
        // 1. Reservation is for today
        // 2. Reservation time is within the next 2 hours (preparation time)
        if ($reservationDateTime->isToday() && $reservationDateTime->diffInHours($now, false) <= 2) {
            $table->update(['status' => 'reserved']);
            \Log::info("Table {$table->number} status updated to reserved (reservation within 2 hours)");
        }
    }

    /**
     * Update table status based on reservation status change
     */
    private function updateTableStatusBasedOnReservation(Reservation $reservation, string $oldStatus, string $newStatus): void
    {
        $table = $reservation->table;
        if (!$table) return;

        $reservationDate = $reservation->date->format('Y-m-d');
        $today = now()->format('Y-m-d');

        // Only update table status for today's reservations
        if ($reservationDate !== $today) {
            return;
        }

        switch ($newStatus) {
            case 'seated':
                $table->update(['status' => 'occupied']);
                break;

            case 'completed':
            case 'cancelled':
            case 'no-show':
                // Sync table status to check for other active reservations
                $this->syncSingleTableStatus($table, $today);
                break;

            case 'pending':
            case 'confirmed':
                // Only set to reserved if reservation is soon (within 2 hours)
                $reservationDateTime = $reservation->getReservationDateTime();
                $now = now();

                if ($reservationDateTime->diffInHours($now, false) <= 2) {
                    $table->update(['status' => 'reserved']);
                }
                break;
        }
    }

    /**
     * Sync a single table's status
     */
    private function syncSingleTableStatus(Table $table, string $date, string $currentTime = null): bool
    {
        if ($table->isUnderMaintenance()) {
            return false;
        }

        $currentTime = $currentTime ?? now()->format('H:i:s');
        $oldStatus = $table->status;
        $newStatus = $this->calculateTableStatus($table, $date, $currentTime);

        if ($oldStatus !== $newStatus) {
            $table->update(['status' => $newStatus]);
            \Log::info("Table {$table->number} status synced from {$oldStatus} to {$newStatus}");
            return true;
        }

        return false;
    }

    /**
     * Calculate what the table status should be
     */
    private function calculateTableStatus(Table $table, string $date, string $currentTime): string
    {
        // Check for currently active reservation (seated)
        $seatedReservation = $table->reservations()
            ->whereDate('date', $date)
            ->where('status', 'seated')
            ->first();

        if ($seatedReservation) {
            return 'occupied';
        }

        // Check for upcoming reservations today
        $upcomingReservation = $table->reservations()
            ->whereDate('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('time', '>=', $currentTime)
            ->orderBy('time')
            ->first();

        if ($upcomingReservation) {
            $reservationTime = Carbon::parse($upcomingReservation->time);
            $now = Carbon::parse($currentTime);

            // Set to reserved if reservation is within 2 hours
            if ($reservationTime->diffInHours($now, false) <= 2) {
                return 'reserved';
            }
        }

        return 'available';
    }
}
