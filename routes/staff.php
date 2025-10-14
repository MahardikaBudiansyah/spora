<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\Merchant\MembershipController;
use App\Http\Controllers\Merchant\FieldController;
use App\Http\Controllers\Merchant\VenueController;
use App\Http\Controllers\Merchant\BookingController;
use App\Http\Controllers\Merchant\ProfileController;
use App\Http\Controllers\Staff\Auth\AuthenticatedSessionController;

Route::middleware('guest:staff')->prefix('staff')->name('staff.')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');
});

Route::middleware(['auth:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Merchant/Dashboard');
    })->name('dashboard');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Profile
    Route::prefix('profiles')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::get('/settings', [ProfileController::class, 'settings'])->name('settings');
    });

    // Akses venue milik merchant tertentu
    Route::prefix('{merchant:slug}')->name('merchant.')->group(function () {
        Route::prefix('venues/{venue:slug}')->name('venues.')->group(function () {

            // hanya bisa lihat & edit/update
            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::get('/edit', [VenueController::class, 'edit'])->name('edit');
            Route::put('/update', [VenueController::class, 'update'])->name('update');

            // Memberships (read only)
            Route::prefix('memberships')->name('memberships.')->group(function () {
                Route::get('/', [MembershipController::class, 'index'])->name('index');
                Route::get('/show', [MembershipController::class, 'show'])->name('show');
            });

            // Bookings (operator butuh ini)
            Route::prefix('bookings')->name('bookings.')->group(function () {
                Route::get('/', [BookingController::class, 'index'])->name('index');
                Route::get('/create', [BookingController::class, 'create'])->name('create');
                Route::get('/search-customer', [BookingController::class, 'searchCustomer'])->name('searchCustomer');
                Route::post('/store', [BookingController::class, 'store'])->name('store');
                Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByVenue'])->name('getTimeslotsByVenue');
            });

            // Fields
            Route::prefix('fields')->name('fields.')->group(function () {
                Route::get('/', [FieldController::class, 'index'])->name('index');
                Route::get('/{field:slug}', [FieldController::class, 'show'])->name('show');
                Route::get('/{field:slug}/edit', [FieldController::class, 'edit'])->name('edit');
                Route::put('/{field:slug}/update', [FieldController::class, 'update'])->name('update');

                // Calendar & Timeslots
                Route::get('/{field:slug}/calendar', [FieldController::class, 'calendar'])->name('calendar');
                Route::get('/{field:slug}/timeslots', [TimeSlotController::class, 'getTimeslotsByField'])->name('getTimeslotsByField');
                Route::post('/{field:slug}/update-slot-statuses', [TimeSlotController::class, 'updateTimeslotStatuses'])->name('updateTimeslotStatuses');
            });
        });
    });
});
