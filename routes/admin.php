<?php

use Inertia\Inertia;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\FieldController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\VenueController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\MerchantController;
use App\Http\Controllers\Admin\MembershipController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\NotifiactionController;
use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;


Route::middleware('guest:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::prefix('profiles')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::get('/settings', [ProfileController::class, 'settings'])->name('settings');
    });

    Route::prefix('admins')->name('admins.')->group(function () {
        Route::middleware('superadmin')->group(function () {
            Route::post('/store', [AdminController::class, 'store'])->name('store');
        });

        // Dynamic routes paling akhir
        Route::get('/', [AdminController::class, 'index'])->name('index');

        Route::middleware('superadmin')->group(function () {
            Route::prefix('{admin}')->group(function () {
                Route::patch('/toggle-active', [AdminController::class, 'toggleActive'])->name('toggleActive');
                Route::put('/update', [AdminController::class, 'update'])->name('update');
                Route::delete('/delete', [AdminController::class, 'destroy'])->name('destroy');
            });
        });
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');

        Route::prefix('{user}')->group(function () {
            Route::get('/', [UserController::class, 'show'])->name('show');
            Route::patch('/toggle-active', [UserController::class, 'toggleActive'])->name('toggleActive');
            Route::delete('/delete', [UserController::class, 'destroy'])->name('destroy');
        });
    });

    Route::prefix('merchants')->name('merchants.')->group(function () {
        Route::get('/', [MerchantController::class, 'index'])->name('index');

        Route::prefix('{merchant:slug}')->group(function () {
            Route::get('/', [MerchantController::class, 'show'])->name('show');
            Route::patch('/toggle-active', [MerchantController::class, 'toggleActive'])->name('toggleActive');
            Route::delete('/delete', [MerchantController::class, 'destroy'])->name('destroy');
        });
    });

    Route::prefix('venues')->name('venues.')->group(function () {
        Route::get('/', [VenueController::class, 'index'])->name('index');

        Route::prefix('{venue:slug}')->group(function () {
            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::patch('/toggle-active', [VenueController::class, 'toggleActive'])->name('toggleActive');
        
            Route::prefix('fields')->name('fields.')->group(function () {

                Route::prefix('{field:slug}')->group(function () {
                    Route::get('/', [FieldController::class, 'show'])->name('show');

                    Route::get('/calendar', [FieldController::class, 'calendar'])->name('calendar');
                    Route::get('/getCalendarMonth', [FieldController::class, 'getCalendarMonth'])->name('getCalendarMonth');
                    Route::get('/getCalendarWeekDays', [FieldController::class, 'getCalendarWeekDays'])->name('getCalendarWeekDays');
                    Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByField'])->name('getTimeslotsByField');
        
                });
            });
        });
    });

    Route::prefix('fields')->name('fields.')->group(function () {
        Route::get('/', [FieldController::class, 'index'])->name('index');
    
    });
    

    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('index');

        Route::prefix('{booking:slug}')->group(function () {
            Route::get('/', [BookingController::class, 'show'])->name('show');
        });

    });

    Route::prefix('memberships')->name('memberships.')->group(function () {
        Route::get('/', [MembershipController::class, 'index'])->name('index');

        Route::prefix('{booking:slug}')->group(function () {
            Route::get('/', [MembershipController::class, 'show'])->name('show');
        });
    });

    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');

        Route::prefix('{transaction:slug}')->group(function () {
            Route::get('/', [TransactionController::class, 'show'])->name('show');
        });
    });

    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('index');

        Route::prefix('{payment:slug}')->group(function () {
            Route::get('/', [PaymentController::class, 'show'])->name('show');
        });
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotifiactionController::class, 'index'])->name('index');
        Route::get('/archive', [NotifiactionController::class, 'archive'])->name('archive');
    });

});