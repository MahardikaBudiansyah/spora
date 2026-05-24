<?php

use App\Http\Controllers\Merchant\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Merchant\Auth\RegisteredUserController;
use App\Http\Controllers\Merchant\CourtController;
use App\Http\Controllers\Merchant\CourtScheduleController;
use App\Http\Controllers\Merchant\CourtTimeSlotController;
use App\Http\Controllers\Merchant\CustomerUtilityController;
use App\Http\Controllers\Merchant\DashboardController;
use App\Http\Controllers\Merchant\MerchantBookingController;
use App\Http\Controllers\Merchant\MerchantController;
use App\Http\Controllers\Merchant\MerchantMembershipCardController;
use App\Http\Controllers\Merchant\MerchantMembershipOrderController;
use App\Http\Controllers\Merchant\MerchantMembershipPackageController;
use App\Http\Controllers\Merchant\MerchantNotificationController;
use App\Http\Controllers\Merchant\MerchantOwnerController;
use App\Http\Controllers\Merchant\MerchantPayoutController;
use App\Http\Controllers\Merchant\MerchantProfileController;
use App\Http\Controllers\Merchant\MerchantVenuePaymentPolicyController;
use App\Http\Controllers\Merchant\OperatorAssignmentController;
use App\Http\Controllers\Merchant\ShiftController;
use App\Http\Controllers\Merchant\StaffController;
use App\Http\Controllers\Merchant\TransactionController;
use App\Http\Controllers\Merchant\VenueBookingController;
use App\Http\Controllers\Merchant\VenueController;
use App\Http\Controllers\Merchant\VenueMembershipCardController;
use App\Http\Controllers\Merchant\VenueMembershipOrderController;
use App\Http\Controllers\Merchant\VenueMembershipPackageController;
use App\Http\Controllers\Merchant\VenuePaymentPolicyController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TimeSlotController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest:merchant')->prefix('merchant')->name('merchant.')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

Route::middleware(['auth:merchant'])->prefix('merchant')->name('merchant.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [MerchantNotificationController::class, 'index'])->name('index');
        Route::get('/archive', [MerchantNotificationController::class, 'archive'])->name('archive');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllRead'])->name('markAllRead');
        Route::post('/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('markAsRead');
        Route::post('/bulk-action', [NotificationController::class, 'bulkAction'])->name('bulkAction');
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [MerchantProfileController::class, 'index'])->name('index');
        Route::put('/update/logo', [MerchantController::class, 'updateLogo'])->name('update.logo');
        Route::post('/update/account', [MerchantController::class, 'updateAccount'])->name('update.account');
        Route::post('/update/account/security', [MerchantController::class, 'updateAccountSecurity'])->name('update.account.security');
        Route::post('/account/request-deactivation', [MerchantController::class, 'requestDeactivation'])->name('account.request-deactivation');
        Route::put('/update/profile', [MerchantProfileController::class, 'update'])->name('update.profile');
        Route::patch('/verification/requestVerification', [MerchantProfileController::class, 'requestVerification'])->name('verification.requestVerification');
        Route::delete('/discard-draft', [MerchantProfileController::class, 'discard'])->name('discard');
    });

    Route::prefix('payouts')->name('payouts.')->group(function () {
        Route::post('/store', [MerchantPayoutController::class, 'store'])->name('store');
        Route::patch('/{id}/set-primary', [MerchantPayoutController::class, 'setPrimary'])->name('setPrimary');
        Route::put('/{id}/update', [MerchantPayoutController::class, 'update'])->name('update');
        Route::patch('/{id}/verification/requestVerification', [MerchantPayoutController::class, 'requestVerification'])->name('verification.requestVerification');
        Route::delete('/{id}/destroy', [MerchantPayoutController::class, 'destroy'])->name('destroy');
        Route::delete('/{id}/sdiscard-draft', [MerchantPayoutController::class, 'discard'])->name('discard');
    });

    Route::prefix('owner')->name('owner.')->group(function () {
        Route::put('/update', [MerchantOwnerController::class, 'update'])->name('update');
        Route::patch('/verification/requestVerification', [MerchantOwnerController::class, 'requestVerification'])->name('verification.requestVerification');
        Route::delete('/discard-draft', [MerchantOwnerController::class, 'discard'])->name('discard');
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

    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/search', [CustomerUtilityController::class, 'searchCustomer'])->name('searchCustomer');
        Route::get('/check', [CustomerUtilityController::class, 'checkCustomer'])->name('checkCustomer');
    });

    Route::prefix('memberships')->name('memberships.')->group(function () {
        Route::prefix('packages')->name('packages.')->group(function () {
            Route::get('/', [MerchantMembershipPackageController::class, 'index'])->name('index');
            Route::post('/store', [MerchantMembershipPackageController::class, 'store'])->name('store');
            Route::put('/{membership_package:slug}/update', [MerchantMembershipPackageController::class, 'update'])->name('update');
            Route::patch('/{membership_package:slug}/is_active', [MerchantMembershipPackageController::class, 'toggleActive'])->name('is_active');
            Route::delete('/{membership_package:slug}/delete', [MerchantMembershipPackageController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('cards')->name('cards.')->group(function () {
            Route::get('/', [MerchantMembershipCardController::class, 'index'])->name('index');
            Route::post('/', [MerchantMembershipCardController::class, 'store'])->name('store');
            Route::patch('{membership_card:slug}/is_active', [MerchantMembershipCardController::class, 'toggleActive'])->name('toggleActive');
            Route::patch('{membership_card:slug}/update', [MerchantMembershipCardController::class, 'update'])->name('update');
            Route::delete('{membership_card:slug}/delete', [MerchantMembershipCardController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [MerchantMembershipOrderController::class, 'index'])->name('index');
            Route::get('/create', [MerchantMembershipOrderController::class, 'create'])->name('create');
            Route::get('/get-packages', [MerchantMembershipOrderController::class, 'getPackages'])->name('getPackages');
            Route::post('/store', [MerchantMembershipOrderController::class, 'store'])->name('store');
            Route::get('/show', [MerchantMembershipOrderController::class, 'show'])->name('show');
        });
    });

    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/', [MerchantBookingController::class, 'index'])->name('index');
        Route::get('/create', [MerchantBookingController::class, 'create'])->name('create');
        Route::post('/store', [MerchantBookingController::class, 'store'])->name('store');
        Route::get('/show', [MerchantBookingController::class, 'show'])->name('show');
    });

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::prefix('payment-policy')->name('payment-policy.')->group(function () {
            Route::get('/', [MerchantVenuePaymentPolicyController::class, 'index'])->name('index');
            Route::post('/update', [MerchantVenuePaymentPolicyController::class, 'update'])->name('update');
        });
    });

    Route::prefix('venues')->name('venues.')->group(function () {
        Route::get('/', [VenueController::class, 'index'])->name('index');
        Route::get('/create', [VenueController::class, 'create'])->name('create');
        Route::post('/store', [VenueController::class, 'store'])->name('store');

        Route::prefix('{venue:slug}')->group(function () {
            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::get('/edit', [VenueController::class, 'edit'])->name('edit');
            Route::put('/update', [VenueController::class, 'update'])->name('update');
            Route::patch('/verification/requestVerification', [VenueController::class, 'requestVerification'])->name('verification.requestVerification');
            Route::delete('/delete', [VenueController::class, 'destroy'])->name('destroy');

            // courts
            Route::prefix('courts')->name('courts.')->group(function () {
                Route::get('/', [CourtController::class, 'index'])->name('index');
                Route::get('/create', [CourtController::class, 'create'])->name('create');
                Route::post('/store', [CourtController::class, 'store'])->name('store');

                Route::prefix('{court:slug}')->group(function () {
                    Route::get('/', [CourtController::class, 'show'])->name('show');
                    Route::get('/edit', [CourtController::class, 'edit'])->name('edit');
                    Route::put('/update', [CourtController::class, 'update'])->name('update');
                    Route::delete('/delete', [CourtController::class, 'destroy'])->name('destroy');

                    Route::get('/calendar', [CourtController::class, 'calendar'])->name('calendar');
                    Route::get('/getCalendarData', [CourtController::class, 'getCalendarData'])->name('getCalendarData');
                    Route::get('/getCalendarMonth', [CourtController::class, 'getCalendarMonth'])->name('getCalendarMonth');
                    Route::get('/getCalendarWeekDays', [CourtController::class, 'getCalendarWeekDays'])->name('getCalendarWeekDays');
                    Route::get('/get-time-slot-by-court', [TimeSlotController::class, 'getTimeSlotsByCourt'])->name('getTimeSlotsByCourt');
                    Route::put('/update-court-time-slots', [CourtTimeSlotController::class, 'updateCourtTimeSlots'])->name('updateCourtTimeSlots');
                    Route::post('/update-court-single-schedules', [CourtScheduleController::class, 'updateCourtSingleSchedule'])->name('updateCourtSingleSchedule');
                    Route::post('/update-court-schedules', [CourtScheduleController::class, 'updateCourtSchedules'])->name('updateCourtSchedules');
                });
            });

            // Memberships
            Route::prefix('memberships')->name('memberships.')->group(function () {
                Route::prefix('packages')->name('packages.')->group(function () {
                    Route::get('/', [VenueMembershipPackageController::class, 'index'])->name('index');
                    Route::post('/', [VenueMembershipPackageController::class, 'store'])->name('store');
                    Route::patch('{package:slug}/is_active', [VenueMembershipPackageController::class, 'toggleActive'])->name('toggle');
                    Route::put('{package:slug}/update', [VenueMembershipPackageController::class, 'update'])->name('update');
                    Route::delete('{package:slug}/delete', [VenueMembershipPackageController::class, 'destroy'])->name('destroy');
                });

                Route::prefix('cards')->name('cards.')->group(function () {
                    Route::get('/', [VenueMembershipCardController::class, 'index'])->name('index');
                    Route::post('/', [VenueMembershipCardController::class, 'store'])->name('store');
                    Route::get('{membership_card:slug}/edit', [VenueMembershipCardController::class, 'edit'])->name('edit');
                    Route::patch('{membership_card:slug}/update', [VenueMembershipCardController::class, 'update'])->name('update');
                    Route::patch('{membership_card:slug}/is_active', [VenueMembershipCardController::class, 'toggleActive'])->name('toggleActive');
                    Route::delete('{membership_card:slug}/delete', [VenueMembershipCardController::class, 'destroy'])->name('destroy');
                });

                Route::prefix('orders')->name('orders.')->group(function () {
                    Route::get('/', [VenueMembershipOrderController::class, 'index'])->name('index');
                    Route::get('/create', [VenueMembershipOrderController::class, 'create'])->name('create');
                    Route::get('/search-customer', [VenueMembershipOrderController::class, 'searchCustomer'])->name('searchCustomer');
                    Route::get('/check-customer', [VenueMembershipOrderController::class, 'checkCustomer'])->name('checkCustomer');
                    Route::post('/store', [VenueMembershipOrderController::class, 'store'])->name('store');
                    Route::get('/show', [VenueMembershipOrderController::class, 'show'])->name('show');
                });
            });

            // Bookings
            Route::prefix('bookings')->name('bookings.')->group(function () {
                Route::get('/', [VenueBookingController::class, 'index'])->name('index');
                Route::get('/create', [VenueBookingController::class, 'create'])->name('create');
                Route::get('/search-customer', [VenueBookingController::class, 'searchCustomer'])->name('searchCustomer');
                Route::post('/store', [VenueBookingController::class, 'store'])->name('store');
                Route::get('/update-court-time-slots', [TimeSlotController::class, 'getTimeslotsByVenue'])->name('getTimeslotsByVenue');
            });

            Route::prefix('transactions')->name('transactions.')->group(function () {
                Route::get('/', [TransactionController::class, 'index'])->name('index');
                Route::post('/store', [TransactionController::class, 'store'])->name('store');
            });

            Route::prefix('settings')->name('settings.')->group(function () {
                Route::prefix('payment-policy')->name('payment-policy.')->group(function () {
                    Route::get('/', [VenuePaymentPolicyController::class, 'index'])->name('index');
                    Route::post('/update', [VenuePaymentPolicyController::class, 'update'])->name('update');
                });
            });
        });
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [MerchantNotificationController::class, 'index'])->name('index');
        Route::get('/archive', [MerchantNotificationController::class, 'archive'])->name('archive');
    });
});
