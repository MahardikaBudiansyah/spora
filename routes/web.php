<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\VenueController;
use App\Http\Controllers\User\BookingController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\XenditCallbackController;
use App\Http\Controllers\GatewayRedirectController;
use App\Http\Controllers\MidtransCallbackController;
use App\Http\Controllers\CourtAvailabilityController;
use App\Http\Controllers\User\MembershipOrderController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');


Route::prefix('venues')->name('venues.')->group(function () {
    Route::get('/', [VenueController::class, 'index'])->name('index');
    Route::get('/{venue:slug}', [VenueController::class, 'show'])->name('show');
    Route::get('/{venue:slug}/get-time-slot-by-venue', [TimeSlotController::class, 'getTimeSlotsByVenue'])->name('getTimeslotsByVenue');
    Route::get('/{venue:slug}/availability', [CourtAvailabilityController::class, 'getTimeslots'])->name('availability');
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/dashboard', function () {
    return Inertia::render('User/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('user')->name('user.')->group(function () {
    // Dashboard
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');
        Route::get('/memberships', [DashboardController::class, 'memberships'])->name('memberships');
        Route::get('/bookings', [DashboardController::class, 'bookings'])->name('bookings');
        Route::get('/notifications', [DashboardController::class, 'notifications'])->name('notifications');
    });


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cart (tanpa ensure.profile.complete)
    Route::prefix('carts')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/store', [CartController::class, 'store'])->name('store');
        Route::delete('/{cart}', [CartController::class, 'destroy'])->name('destroy');
        Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
    });

    Route::prefix('memberships')->name('memberships.')->middleware(['ensure.profile.complete'])->group(function () {
        Route::post('/selectPackages', [MembershipOrderController::class, 'selectPackages'])->name('selectPackages');
        Route::get('/create', [MembershipOrderController::class, 'create'])->name('create');
        Route::post('/calculate', [MembershipOrderController::class, 'calculate'])->name('calculate');
        Route::post('/store', [MembershipOrderController::class, 'store'])->name('store');
        Route::post('/{membership:slug}/payment-token', [MembershipOrderController::class, 'getPaymentToken'])->name('payment_token');
    });

    Route::prefix('bookings')->name('bookings.')->middleware(['ensure.profile.complete'])->group(function () {
        Route::post('/prepareCheckout', [BookingController::class, 'prepareCheckout'])->name('prepareCheckout');

        Route::middleware(['ensure.booking.cart.selected'])->group(function () {
            Route::get('/create', [BookingController::class, 'create'])->name('create');
            Route::post('/calculate', [BookingController::class, 'calculate'])->name('calculate');
            Route::post('/store', [BookingController::class, 'store'])->name('store');
        });

        Route::post('/{booking:slug}/payment-token', [BookingController::class, 'getPaymentToken'])->name('payment_token');
    });

    Route::prefix('payments')->name('payment.')->group(function () {
        Route::get('/success/{type}/{orderId}', [GatewayRedirectController::class, 'success'])
            ->name('success')
            ->whereIn('type', ['booking', 'membership']);

        Route::get('/failed', [GatewayRedirectController::class, 'failed'])
            ->name('failed');
    });
});


Route::post('/midtrans/callback', [MidtransCallbackController::class, 'callback'])->name('midtrans.callback');
Route::post('/xendit/callback', [XenditCallbackController::class, 'callback'])->name('xendit.callback');


require __DIR__ . '/auth.php';
