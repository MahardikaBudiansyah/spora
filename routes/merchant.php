<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Merchant\FieldController;
use App\Http\Controllers\Merchant\VenueController;
use App\Http\Controllers\MerchantSettingController;
use App\Http\Controllers\Merchant\BookingController;
use App\Http\Controllers\Merchant\ProfileController;
use App\Http\Controllers\OperatorAssignmentController;
use App\Http\Controllers\Merchant\MembershipController;
use App\Http\Controllers\Merchant\NotifiactionController;
use App\Http\Controllers\Merchant\MembershipUserController;
use App\Http\Controllers\Merchant\MembershipPackageController;
use App\Http\Controllers\Merchant\MerchantMembershipController;
use App\Http\Controllers\Merchant\Auth\RegisteredUserController;
use App\Http\Controllers\Merchant\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Merchant\MerchantMembershipPackageController;

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

        Route::prefix('{staff}')->group(function () {
            Route::get('/show', [StaffController::class, 'show'])->name('show');
            Route::patch('/updateStatus', [StaffController::class, 'updateStatus'])->name('updateStatus');
            Route::get('/edit', [StaffController::class, 'edit'])->name('edit');
            Route::put('/update', [StaffController::class, 'update'])->name('update');
            Route::delete('/delete', [StaffController::class, 'destroy'])->name('delete');

            Route::prefix('operators')->name('operator.')->group(function () {
                Route::get('/', [OperatorAssignmentController::class, 'index'])->name('index');
                Route::get('/paginated', [OperatorAssignmentController::class, 'paginated'])->name('paginated');
                Route::post('/store', [OperatorAssignmentController::class, 'store'])->name('store');
                Route::put('/{assignment}/update', [OperatorAssignmentController::class, 'update'])->name('update');
                Route::delete('/{assignment}/delete', [OperatorAssignmentController::class, 'destroy'])->name('destroy');
            });
        });
    });

    Route::prefix('memberships')->name('memberships.')->group(function () {
        Route::get('/', [MerchantMembershipController::class, 'index'])->name('index');
        Route::get('/create', [MerchantMembershipController::class, 'create'])->name('create');
        Route::post('/store', [MerchantMembershipController::class, 'store'])->name('store');
        Route::get('/show', [MerchantMembershipController::class, 'show'])->name('show');
        
        Route::prefix('packages')->name('packages.')->group(function () {
            Route::get('/', [MerchantMembershipPackageController::class, 'index'])->name('index');
            Route::post('/store', [MerchantMembershipPackageController::class, 'store'])->name('store');
            Route::put('/{membershipPackages:slug}/update', [MerchantMembershipPackageController::class, 'update'])->name('update');
            Route::delete('/{membershipPackages:slug}/delete', [MerchantMembershipPackageController::class, 'destroy'])->name('destroy');
            Route::patch('/{membershipPackages:slug}/is_active', [MerchantMembershipPackageController::class, 'toggleActive'])->name('is_active');
            
        });
    });
    
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [MerchantSettingController::class, 'index'])->name('index');
        Route::post('/update', [MerchantSettingController::class, 'update'])->name('update');
        
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
                    Route::get('/getCalendarMonth', [FieldController::class, 'getCalendarMonth'])->name('getCalendarMonth');
                    Route::get('/getCalendarWeekDays', [FieldController::class, 'getCalendarWeekDays'])->name('getCalendarWeekDays');
                    Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByField'])->name('getTimeslotsByField');
                    Route::post('/update-timeslots', [TimeSlotController::class, 'updateTimeslots'])->name('updateTimeslots');
                    Route::post('/update-slot-statuses', [TimeSlotController::class, 'updateTimeslotStatuses'])->name('updateTimeslotStatuses');
                });
            });

            // Memberships
            Route::prefix('memberships')->name('memberships.')->group(function () {
                Route::prefix('packages')->name('packages.')->group(function () {
                    Route::get('/', [MembershipPackageController::class, 'index'])->name('index');
                    Route::post('/', [MembershipPackageController::class, 'store'])->name('store');
                    Route::patch('{package:slug}/is_active', [MembershipPackageController::class, 'toggleActive'])->name('toggle');
                    Route::put('{package:slug}/update', [MembershipPackageController::class, 'update'])->name('update');
                    Route::delete('{package:slug}/delete', [MembershipPackageController::class, 'destroy'])->name('destroy');
                });
                
                Route::prefix('members')->name('members.')->group(function () {
                    Route::get('/', [MembershipUserController::class, 'index'])->name('index');
                    Route::post('/', [MembershipUserController::class, 'store'])->name('store');
                    Route::patch('{membershipUsers:slug}/is_active', [MembershipUserController::class, 'toggleActive'])->name('toggle');
                    Route::put('{membershipUsers:slug}/update', [MembershipUserController::class, 'update'])->name('update');
                    Route::delete('{membershipUsers:slug}/delete', [MembershipUserController::class, 'destroy'])->name('destroy');
                });

                Route::prefix('orders')->name('orders.')->group(function () {
                    Route::get('/', [MembershipController::class, 'index'])->name('index');
                    Route::get('/create', [MembershipController::class, 'create'])->name('create');
                    Route::post('/store', [MembershipController::class, 'store'])->name('store');
                    Route::get('/show', [MembershipController::class, 'show'])->name('show');
                });
            });

            // Bookings
            Route::prefix('bookings')->name('bookings.')->group(function () {
                Route::get('/', [BookingController::class, 'index'])->name('index');
                Route::get('/create', [BookingController::class, 'create'])->name('create');
                Route::get('/search-customer', [BookingController::class, 'searchCustomer'])->name('searchCustomer');
                Route::post('/store', [BookingController::class, 'store'])->name('store');
                Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByVenue'])->name('getTimeslotsByVenue');
            });

            Route::prefix('transactions')->name('transactions.')->group(function () {
                Route::get('/', [TransactionController::class, 'index'])->name('index');       
                Route::post('/store', [TransactionController::class, 'store'])->name('store');
            });

           

            Route::prefix('settings')->name('settings.')->group(function () {
                Route::get('/', [SettingController::class, 'index'])->name('index');

            });
        });


    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotifiactionController::class, 'index'])->name('index');
        Route::get('/archive', [NotifiactionController::class, 'archive'])->name('archive');
    });
});
