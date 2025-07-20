<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    /**
     * Get all tables
     */
    public function index(Request $request): JsonResponse
    {
        $query = Table::orderBy('number');

        // Return all tables regardless of status
        $tables = $query->get();
        return response()->json($tables);
    }

    /**
     * Store a new table
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'number' => 'required|integer|min:1|unique:tables,number',
                'capacity' => 'required|integer|min:1|max:20',
                'location' => 'required|string|max:50'
            ]);

            $tableData = array_merge($validated, ['status' => 'available']);
            $table = Table::create($tableData);
            \Log::info("New table created: {$table->number}");
            return response()->json($table, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating table: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create table: ' . $e->getMessage()], 422);
        }
    }

    /**
     * Update a table
     */
    public function update(Request $request, Table $table): JsonResponse
    {
        $validated = $request->validate([
            'number' => ['required', 'integer', 'min:1', Rule::unique('tables')->ignore($table->id)],
            'capacity' => 'required|integer|min:1|max:20',
            'location' => 'required|string|max:50'
        ]);

        $table->update($validated);
        return response()->json($table);
    }

    /**
     * Delete a table
     */
    public function destroy(Table $table): JsonResponse
    {
        // Check if table has active reservations
        if ($table->activeReservations()->exists()) {
            return response()->json([
                'message' => 'Cannot delete table with active reservations'
            ], 422);
        }

        $table->delete();
        return response()->json(['message' => 'Table deleted successfully']);
    }

    /**
     * Update table status with proper validation
     */
    public function updateStatus(Request $request, Table $table): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,reserved,maintenance'
        ]);

        $currentStatus = $table->status;
        $newStatus = $validated['status'];

        // Validate status transitions
        if (!$this->isValidStatusTransition($currentStatus, $newStatus)) {
            return response()->json([
                'message' => "Invalid status transition from {$currentStatus} to {$newStatus}"
            ], 422);
        }

        // Use database transaction for atomic update
        return DB::transaction(function () use ($table, $validated, $currentStatus, $newStatus) {
            // Lock the table row to prevent race conditions
            $table = Table::lockForUpdate()->find($table->id);

            // Additional validation for specific status changes
            if ($newStatus === 'occupied' && $currentStatus !== 'reserved') {
                // Check if there's an active reservation for this table
                $hasActiveReservation = $table->reservations()
                    ->today()
                    ->active()
                    ->exists();

                if (!$hasActiveReservation) {
                    return response()->json([
                        'message' => 'Cannot set table to occupied without an active reservation'
                    ], 422);
                }
            }

            $table->update($validated);

            \Log::info("Table {$table->number} status changed from {$currentStatus} to {$newStatus}");

            return response()->json($table);
        });
    }

    /**
     * Validate if status transition is allowed
     */
    private function isValidStatusTransition(string $from, string $to): bool
    {
        // If same status, always allow (no change)
        if ($from === $to) {
            return true;
        }

        $validTransitions = [
            'available' => ['reserved', 'occupied', 'maintenance'],
            'reserved' => ['occupied', 'available', 'maintenance'],
            'occupied' => ['available', 'maintenance'],
            'maintenance' => ['available']
        ];

        return in_array($to, $validTransitions[$from] ?? []);
    }

    /**
     * Get table availability for a specific date and time range
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30|max:480',
            'guests' => 'required|integer|min:1|max:20'
        ]);

        $availableTables = Table::where('status', '!=', 'maintenance')
            ->where('capacity', '>=', $validated['guests'])
            ->whereDoesntHave('reservations', function ($query) use ($validated) {
                $query->where('date', $validated['date'])
                    ->active()
                    ->where(function ($subQuery) use ($validated) {
                        $requestStart = $validated['time'];
                        $requestEnd = \Carbon\Carbon::parse($validated['time'])
                            ->addMinutes($validated['duration'])
                            ->format('H:i');

                        $subQuery->whereRaw('(
                            (time <= ? AND ADDTIME(time, SEC_TO_TIME(duration * 60)) > ?) OR
                            (time < ? AND ADDTIME(time, SEC_TO_TIME(duration * 60)) >= ?) OR
                            (time >= ? AND time < ?)
                        )', [$requestStart, $requestStart, $requestEnd, $requestEnd, $requestStart, $requestEnd]);
                    });
            })
            ->orderBy('capacity')
            ->orderBy('number')
            ->get();

        return response()->json([
            'available_tables' => $availableTables,
            'total_available' => $availableTables->count(),
            'search_criteria' => $validated
        ]);
    }

    /**
     * Get table status summary
     */
    public function statusSummary(): JsonResponse
    {
        $summary = Table::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => $item->count];
            });

        $total = Table::count();

        return response()->json([
            'summary' => $summary,
            'total_tables' => $total,
            'timestamp' => now()
        ]);
    }

    /**
     * Bulk update table statuses (for admin use)
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_ids' => 'required|array',
            'table_ids.*' => 'exists:tables,id',
            'status' => 'required|in:available,occupied,reserved,maintenance'
        ]);

        $updatedCount = 0;
        $errors = [];

        DB::transaction(function () use ($validated, &$updatedCount, &$errors) {
            foreach ($validated['table_ids'] as $tableId) {
                try {
                    $table = Table::lockForUpdate()->find($tableId);

                    if ($this->isValidStatusTransition($table->status, $validated['status'])) {
                        $table->update(['status' => $validated['status']]);
                        $updatedCount++;
                        \Log::info("Bulk update: Table {$table->number} status changed to {$validated['status']}");
                    } else {
                        $errors[] = "Table {$table->number}: Invalid transition from {$table->status} to {$validated['status']}";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Table ID {$tableId}: " . $e->getMessage();
                }
            }
        });

        return response()->json([
            'message' => "Bulk update completed",
            'updated_count' => $updatedCount,
            'total_requested' => count($validated['table_ids']),
            'errors' => $errors
        ]);
    }
}
