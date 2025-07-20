<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Sync table statuses every 5 minutes
        $schedule->command('sync:table-status')
            ->everyFiveMinutes()
            ->description('Synchronize table statuses with reservations')
            ->withoutOverlapping() // Prevent multiple instances running simultaneously
            ->onOneServer(); // Only run on one server in multi-server setup

        // Optional: Additional schedules you might want

        // Cleanup old reservations daily
        // $schedule->command('cleanup:old-reservations')
        //          ->daily()
        //          ->at('02:00');

        // Send reminder emails for upcoming reservations
        // $schedule->command('send:reservation-reminders')
        //          ->hourly()
        //          ->between('08:00', '22:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
