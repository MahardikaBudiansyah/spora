<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CourtCategoryController;
use App\Http\Controllers\Admin\CourtController;
use App\Http\Controllers\Admin\CourtSurfaceController;
use App\Http\Controllers\Admin\MembershipCardController;
use App\Http\Controllers\Admin\MembershipOrderController;
use App\Http\Controllers\Admin\MerchantController;
use App\Http\Controllers\Admin\MerchantVerificationController;
use App\Http\Controllers\Admin\NotifiactionController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PlatformPayoutMethodController;
use App\Http\Controllers\Admin\PlatformProfileController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VenueCategoryController;
use App\Http\Controllers\Admin\VenueController;
use App\Http\Controllers\Admin\VenueFacilityController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TimeSlotController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


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

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('/mark-all-read', [NotificationController::class, 'markAllRead'])->name('markAllRead');
        Route::post('/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('markAsRead');
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [AdminProfileController::class, 'index'])->name('index');
        Route::put('/update/avatar', [AdminProfileController::class, 'updateAvatar'])->name('update.avatar');
        Route::post('/update/account', [AdminProfileController::class, 'updateAccount'])->name('update.account');
        Route::post('/update/account/security', [AdminProfileController::class, 'updateAccountSecurity'])->name('update.account.security');
        Route::post('/account/request-deactivation', [AdminProfileController::class, 'requestDeactivation'])->name('account.request-deactivation');
        Route::put('/update/profile', [AdminProfileController::class, 'update'])->name('update');

        Route::prefix('platform')->name('platform.')->group(function () {
            Route::put('/update/profile', [PlatformProfileController::class, 'update'])->name('update');
            Route::put('/update/logo', [PlatformProfileController::class, 'updateLogo'])->name('update.logo');

            Route::prefix('payouts')->name('payouts.')->group(function () {
                Route::post('/store', [PlatformPayoutMethodController::class, 'store'])->name('store');
                Route::patch('/{id}/set-primary', [PlatformPayoutMethodController::class, 'setPrimary'])->name('setPrimary');
                Route::put('/{id}/update', [PlatformPayoutMethodController::class, 'update'])->name('update');
                Route::delete('/{id}/destroy', [PlatformPayoutMethodController::class, 'destroy'])->name('destroy');
            });
        });
    });



    Route::prefix('admins')->name('admins.')->group(function () {
        Route::middleware('superadmin')->group(function () {
            Route::post('/store', [AdminController::class, 'store'])->name('store');
        });

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

            Route::prefix('verification')->name('verification.')->group(function () {
                Route::get('/', [MerchantVerificationController::class, 'index'])->name('index');
                Route::patch('/owner', [MerchantVerificationController::class, 'updateMerchantOwnerVerification'])->name('updateMerchantOwnerVerification');
                Route::patch('/profile', [MerchantVerificationController::class, 'updateMerchantProfileVerification'])->name('updateMerchantProfileVerification');
                Route::patch('/payout/{payout_method}', [MerchantVerificationController::class, 'updatePayoutMethodVerification'])->name('updatePayoutMethodVerification');

                Route::patch('/all', [MerchantVerificationController::class, 'updateAllVerification'])->name('updateAllVerification');
            });
        });
    });

    Route::prefix('venues')->name('venues.')->group(function () {
        Route::get('/', [VenueController::class, 'index'])->name('index');

        Route::prefix('{venue:slug}')->group(function () {
            Route::get('/', [VenueController::class, 'show'])->name('show');
            Route::patch('/toggle-active', [VenueController::class, 'toggleActive'])->name('toggleActive');

            Route::prefix('courts')->name('courts.')->group(function () {

                Route::prefix('{court:slug}')->group(function () {
                    Route::get('/', [CourtController::class, 'show'])->name('show');

                    Route::get('/calendar', [CourtController::class, 'calendar'])->name('calendar');
                    Route::get('/getCalendarMonth', [CourtController::class, 'getCalendarMonth'])->name('getCalendarMonth');
                    Route::get('/getCalendarWeekDays', [CourtController::class, 'getCalendarWeekDays'])->name('getCalendarWeekDays');
                    Route::get('/timeslots', [TimeSlotController::class, 'getTimeslotsByCourt'])->name('getTimeslotsByCourt');
                });
            });
        });
    });

    Route::get('courts', [CourtController::class, 'index'])->name('courts.index');

    Route::prefix('membership-cards')->name('membershipCards.')->group(function () {
        Route::get('/', [MembershipCardController::class, 'index'])->name('index');

        Route::prefix('{membershipCard:slug}')->group(function () {
            Route::patch('/toggle-active', [MembershipCardController::class, 'toggleActive'])->name('toggleActive');
            Route::delete('/delete', [MembershipCardController::class, 'destroy'])->name('destroy');
        });
    });

    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('index');

        Route::prefix('{booking:slug}')->group(function () {
            Route::get('/', [BookingController::class, 'show'])->name('show');
        });
    });

    Route::prefix('membership-orders')->name('membershipOrders.')->group(function () {
        Route::get('/', [MembershipOrderController::class, 'index'])->name('index');

        Route::prefix('{id}')->group(function () {
            Route::get('/', [MembershipOrderController::class, 'show'])->name('show');
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

    Route::prefix('master-data')->name('masterData.')->group(function () {
        Route::prefix('venue-faciliities')->name('venueFacilities.')->group(function () {
            Route::get('/', [VenueFacilityController::class, 'index'])->name('index');
            Route::patch('/{id}/inline-update', [VenueFacilityController::class, 'inlineUpdate'])->name('inline-update');
            Route::post('/store', [VenueFacilityController::class, 'store'])->name('store');
            Route::delete('/{id}/delete', [VenueFacilityController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('venue-categories')->name('venueCategories.')->group(function () {
            Route::get('/', [VenueCategoryController::class, 'index'])->name('index');
            Route::patch('/{id}/inline-update', [VenueCategoryController::class, 'inlineUpdate'])->name('inline-update');
            Route::post('/store', [VenueCategoryController::class, 'store'])->name('store');
            Route::delete('/{id}/delete', [VenueCategoryController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('court-categories')->name('courtCategories.')->group(function () {
            Route::get('/', [CourtCategoryController::class, 'index'])->name('index');
            Route::patch('/{id}/inline-update', [CourtCategoryController::class, 'inlineUpdate'])->name('inline-update');
            Route::post('/store', [CourtCategoryController::class, 'store'])->name('store');
            Route::delete('/{id}/delete', [CourtCategoryController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('court-surfaces')->name('courtSurfaces.')->group(function () {
            Route::get('/', [CourtSurfaceController::class, 'index'])->name('index');
            Route::patch('/{id}/inline-update', [CourtSurfaceController::class, 'inlineUpdate'])->name('inline-update');
            Route::post('/store', [CourtSurfaceController::class, 'store'])->name('store');
            Route::delete('/{id}/delete', [CourtSurfaceController::class, 'destroy'])->name('destroy');
        });
    });
});
