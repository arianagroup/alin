<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Reservation extends Model
{
    protected $fillable = [
        'customerName',
        'customerPhone',
        'customerEmail',
        'date',
        'time',
        'duration',
        'guests',
        'tableId',
        'status',
        'specialRequests',
        'notes'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'duration' => 'integer',
        'guests' => 'integer',
        'tableId' => 'integer',
    ];

    /**
     * Get the table for this reservation
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class, 'tableId');
    }

    /**
     * Check if reservation is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if reservation is confirmed
     */
    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if reservation is seated
     */
    public function isSeated(): bool
    {
        return $this->status === 'seated';
    }

    /**
     * Check if reservation is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if reservation is cancelled
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if reservation is no-show
     */
    public function isNoShow(): bool
    {
        return $this->status === 'no-show';
    }

    /**
     * Get reservation date and time as Carbon instance
     */
    public function getReservationDateTime(): Carbon
    {
        return Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->time->format('H:i:s'));
    }

    /**
     * Get reservation end time
     */
    public function getEndDateTime(): Carbon
    {
        return $this->getReservationDateTime()->addMinutes($this->duration);
    }

    /**
     * Check if reservation is active (today and not completed/cancelled)
     */
    public function isActive(): bool
    {
        return $this->date->isToday() && 
               in_array($this->status, ['pending', 'confirmed', 'seated']);
    }

    /**
     * Scope for today's reservations
     */
    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }

    /**
     * Scope for active reservations
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'confirmed', 'seated']);
    }
}