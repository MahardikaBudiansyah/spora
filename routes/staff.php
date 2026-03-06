<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\Merchant\MembershipController;
use App\Http\Controllers\Merchant\CourtController;
use App\Http\Controllers\Merchant\VenueController;
use App\Http\Controllers\Merchant\VenueBookingController;
use App\Http\Controllers\Merchant\StaffProfileController;
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
        Route::get('/', [StaffProfileController::class, 'index'])->name('index');
        Route::get('/edit', [StaffProfileController::class, 'edit'])->name('edit');
        Route::get('/settings', [StaffProfileController::class, 'settings'])->name('settings');
    });

    // Akses venue milik merchant tertentu
    Route::prefix('{merchant:slug}')->name('merchant.')->group(function () {
        Route::prefix('venues/{venue:slug}')->name('venues.')->group(function () {

            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::get('/edit', [VenueController::class, 'edit'])->name('edit');
            Route::put('/update', [VenueController::class, 'update'])->name('update');

            Route::prefix('memberships')->name('memberships.')->group(function () {
                Route::get('/', [MembershipController::class, 'index'])->name('index');
                Route::get('/show', [MembershipController::class, 'show'])->name('show');
            });

            Route::prefix('bookings')->name('bookings.')->group(function () {
                Route::get('/', [VenueBookingController::class, 'index'])->name('index');
                Route::get('/create', [VenueBookingController::class, 'create'])->name('create');
                Route::get('/search-customer', [VenueBookingController::class, 'searchCustomer'])->name('searchCustomer');
                Route::post('/store', [VenueBookingController::class, 'store'])->name('store');
                Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByVenue'])->name('getTimeslotsByVenue');
            });

            // courts
            Route::prefix('courts')->name('courts.')->group(function () {
                Route::get('/', [CourtController::class, 'index'])->name('index');
                Route::get('/{court:slug}', [CourtController::class, 'show'])->name('show');
                Route::get('/{court:slug}/edit', [CourtController::class, 'edit'])->name('edit');
                Route::put('/{court:slug}/update', [CourtController::class, 'update'])->name('update');

                // Calendar & Timeslots
                Route::get('/{court:slug}/calendar', [CourtController::class, 'calendar'])->name('calendar');
                Route::get('/{court:slug}/timeslots', [TimeSlotController::class, 'getTimeslotsByCourt'])->name('getTimeslotsByCourt');
                Route::post('/{court:slug}/update-slot-statuses', [TimeSlotController::class, 'updateTimeslotStatuses'])->name('updateTimeslotStatuses');
            });
        });
    });
});
