<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    protected $fillable = [
        'number',
        'capacity',
        'location',
        'status'
    ];

    protected $casts = [
        'number' => 'integer',
        'capacity' => 'integer',
    ];

    /**
     * Get all reservations for this table
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'tableId');
    }

    /**
     * Get active reservations for this table
     */
    public function activeReservations(): HasMany
    {
        return $this->reservations()->whereIn('status', ['pending', 'confirmed', 'seated']);
    }

    /**
     * Check if table is available
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Check if table is occupied
     */
    public function isOccupied(): bool
    {
        return $this->status === 'occupied';
    }

    /**
     * Check if table is reserved
     */
    public function isReserved(): bool
    {
        return $this->status === 'reserved';
    }

    /**
     * Check if table is under maintenance
     */
    public function isUnderMaintenance(): bool
    {
        return $this->status === 'maintenance';
    }
}