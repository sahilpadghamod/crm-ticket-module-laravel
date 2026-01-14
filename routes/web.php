<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

// User Routes (Login/Register)
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'loginView'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [AuthController::class, 'registerView'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

    Route::middleware('auth')->group(function () {

    Route::put('/tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [TicketController::class, 'index'])->name('dashboard');

    // Ticket Actions
    Route::post('/tickets/create', [TicketController::class, 'store'])->name('tickets.store');
    Route::post('/tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.status');
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

    // Admin Actions 
    Route::post('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});