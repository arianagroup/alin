<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ReservationController;

class SyncTableStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:table-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize table statuses based on current reservations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting table status synchronization...');

        try {
            $controller = new ReservationController();
            $result = $controller->syncTableStatuses();

            // Get the response data
            $data = json_decode($result->getContent(), true);

            $this->info("✅ Table statuses synchronized successfully!");
            $this->info("📊 Synced: {$data['synced_count']} tables");
            $this->info("📋 Total: {$data['total_tables']} tables");

            // Log the operation
            \Log::info('Scheduled table sync completed', [
                'synced_count' => $data['synced_count'],
                'total_tables' => $data['total_tables'],
                'timestamp' => now()
            ]);

        } catch (\Exception $e) {
            $this->error('❌ Error synchronizing table statuses: ' . $e->getMessage());
            \Log::error('Scheduled table sync failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'timestamp' => now()
            ]);
            return 1;
        }

        return 0;
    }
}
