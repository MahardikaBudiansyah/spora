<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\Merchant\FieldController;
use App\Http\Controllers\Merchant\VenueController;
use App\Http\Controllers\Merchant\BookingController;
use App\Http\Controllers\Merchant\ProfileController;
use App\Http\Controllers\OperatorAssignmentController;
use App\Http\Controllers\Merchant\Auth\RegisteredUserController;
use App\Http\Controllers\Merchant\Auth\AuthenticatedSessionController;

Route::middleware('guest:merchant')->prefix('merchant')->name('merchant.')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

Route::middleware(['auth:merchant'])->prefix('merchant')->name('merchant.')->group(function () {
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

    // Shifts
    Route::prefix('shifts')->name('shift.')->group(function () {
        Route::get('/', [ShiftController::class, 'index'])->name('index');
        Route::post('/store', [ShiftController::class, 'store'])->name('store');
        Route::put('/{shift}', [ShiftController::class, 'update'])->name('update');
        Route::delete('/{shift}', [ShiftController::class, 'destroy'])->name('destroy');
    });

    // Staff
    Route::prefix('staff')->name('staff.')->group(function () {
        Route::post('/syncMerchantRoles', [StaffController::class, 'syncMerchantRoles'])->name('syncMerchantRoles');
        Route::get('/', [StaffController::class, 'index'])->name('index');
        Route::post('/store', [StaffController::class, 'store'])->name('store');

        Route::prefix('{staff:slug}')->group(function () {
            Route::patch('/status', [StaffController::class, 'updateStatus'])->name('updateStatus');
            Route::get('/edit', [StaffController::class, 'edit'])->name('edit');
            Route::put('/update', [StaffController::class, 'update'])->name('update');
            Route::delete('/delete', [StaffController::class, 'destroy'])->name('delete');

            Route::prefix('operators')->name('operator.')->group(function () {
                Route::post('/storeVenue', [OperatorAssignmentController::class, 'storeVenue'])->name('storeVenue');
                Route::get('/', [OperatorAssignmentController::class, 'index'])->name('index');
                Route::get('/create', [OperatorAssignmentController::class, 'create'])->name('create');
                Route::post('/store', [OperatorAssignmentController::class, 'store'])->name('store');
                Route::get('/{assignment}/edit', [OperatorAssignmentController::class, 'edit'])->name('edit');
                Route::put('/{assignment}', [OperatorAssignmentController::class, 'update'])->name('update');
                Route::delete('/{assignment}', [OperatorAssignmentController::class, 'destroy'])->name('destroy');
            });
        });
    });

    // Venues (manual, tanpa resource)
    Route::prefix('venues')->name('venues.')->group(function () {
        Route::get('/', [VenueController::class, 'index'])->name('index');
        Route::get('/create', [VenueController::class, 'create'])->name('create');
        Route::post('/store', [VenueController::class, 'store'])->name('store');

        Route::prefix('{venue:slug}')->group(function () {
            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::get('/edit', [VenueController::class, 'edit'])->name('edit');
            Route::put('/update', [VenueController::class, 'update'])->name('update');
            Route::delete('/delete', [VenueController::class, 'destroy'])->name('destroy');

            // Memberships
            Route::prefix('memberships')->name('memberships.')->group(function () {
                Route::get('/', [MembershipController::class, 'index'])->name('index');
                Route::get('/show', [MembershipController::class, 'show'])->name('show');
            });

            // Bookings
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
                Route::get('/create', [FieldController::class, 'create'])->name('create');
                Route::post('/store', [FieldController::class, 'store'])->name('store');

                Route::prefix('{field:slug}')->group(function () {
                    Route::get('/', [FieldController::class, 'show'])->name('show');
                    Route::get('/edit', [FieldController::class, 'edit'])->name('edit');
                    Route::put('/update', [FieldController::class, 'update'])->name('update');
                    Route::delete('/delete', [FieldController::class, 'destroy'])->name('destroy');

                    Route::get('/calendar', [FieldController::class, 'calendar'])->name('calendar');
                    Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByField'])->name('getTimeslotsByField');
                    Route::post('/update-timeslots', [TimeSlotController::class, 'updateTimeslots'])->name('updateTimeslots');
                    Route::post('/update-slot-statuses', [TimeSlotController::class, 'updateTimeslotStatuses'])->name('updateTimeslotStatuses');
                });
            });
        });
    });
});
