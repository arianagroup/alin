<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    if (auth()->check()) {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.home');
        } else if (auth()->user()->role === 'pelanggan') {
            return redirect()->route('pelanggan.reservasi');
        }
    }
    return Inertia::render('auth/login');
})->name('home');



// Route ini dipindahkan ke dalam middleware auth dan role:pelanggan

// Route untuk pelanggan reservasi meja
Route::middleware(['auth', 'role:pelanggan'])->group(function () {
    Route::get('/reservasi', function () {
        return Inertia::render('pelanggan/Home');
    })->name('pelanggan.reservasi');

    Route::get('/pelanggan/reservations', function () {
        return Inertia::render('pelanggan/CustomerReservations');
    })->name('pelanggan.reservations');
});

// API routes untuk pelanggan
Route::prefix('api/pelanggan')->middleware('web')->group(function () {
    Route::get('/tables', [\App\Http\Controllers\TableController::class, 'index']);
    Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store']);
    Route::get('/reservations', [\App\Http\Controllers\ReservationController::class, 'customerReservations'])->middleware('auth');
    Route::patch('/reservations/{reservation}/status', [\App\Http\Controllers\ReservationController::class, 'updateCustomerStatus'])->middleware('auth');
    Route::patch('/tables/{table}/status', [\App\Http\Controllers\TableController::class, 'updateStatus']);
});

// Tambahkan route untuk debugging
Route::get('/debug-reservations', function() {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return response()->json([
            'user' => \Illuminate\Support\Facades\Auth::user(),
            'reservations' => \App\Models\Reservation::where('customerEmail', \Illuminate\Support\Facades\Auth::user()->email)->get()
        ]);
    }
    return response()->json(['error' => 'Not authenticated'], 401);
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// tambah routes untuk home admin
Route::middleware(['auth', 'role:admin', \App\Http\Middleware\PreventBackHistory::class])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('admin/Home');
    })->name('admin.home');
    Route::get('/admin', [\App\Http\Controllers\AdminDashboardController::class, 'index'])->name('admin.home');

    // API routes untuk tables management
    Route::prefix('admin/api')->middleware('web')->group(function () {

        Route::get('/customers', [\App\Http\Controllers\AdminDashboardController::class, 'getCustomersData']);
        // Tables
        Route::get('/tables', [\App\Http\Controllers\TableController::class, 'index']);
        Route::post('/tables', [\App\Http\Controllers\TableController::class, 'store']);
        Route::put('/tables/{table}', [\App\Http\Controllers\TableController::class, 'update']);
        Route::delete('/tables/{table}', [\App\Http\Controllers\TableController::class, 'destroy']);
        Route::patch('/tables/{table}/status', [\App\Http\Controllers\TableController::class, 'updateStatus']);


        // Reservations
        Route::get('/reservations', [\App\Http\Controllers\ReservationController::class, 'index']);
        Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store']);
        Route::put('/reservations/{reservation}', [\App\Http\Controllers\ReservationController::class, 'update']);
        Route::delete('/reservations/{reservation}', [\App\Http\Controllers\ReservationController::class, 'destroy']);
        Route::patch('/reservations/{reservation}/status', [\App\Http\Controllers\ReservationController::class, 'updateStatus']);
        Route::post('/reservations/sync-table-statuses', [\App\Http\Controllers\ReservationController::class, 'syncTableStatuses']);
    });
});
