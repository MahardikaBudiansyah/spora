<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;

use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\User\VenueController;
use App\Http\Controllers\User\BookingController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\MembershipController;
use App\Http\Controllers\MidtransCallbackController;

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
    Route::get('/{venue:slug}/timeslots', [TimeSlotController::class, 'getTimeslotsByVenue'])
        ->name('timeslots');
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    
    // Profile (boleh diakses kapan saja, supaya bisa melengkapi profil)
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
        Route::post('/selectPackages', [MembershipController::class, 'selectPackages'])->name('selectPackages');
        Route::get('/create', [MembershipController::class, 'create'])->name('create');
        Route::post('/store', [MembershipController::class, 'store'])->name('store');
        
    });


    // Booking (butuh profil lengkap)
    Route::prefix('bookings')->name('booking.')->middleware(['ensure.profile.complete'])->group(function () {
        // Pastikan cart sudah dipilih
        Route::middleware(['ensure.booking.cart.selected'])->group(function () {
            Route::get('/create', [BookingController::class, 'create'])->name('create');
            Route::post('/store', [BookingController::class, 'store'])->name('store');
        });
    });

    
    
    Route::prefix('payments')->name('payment.')->group(function () {
        Route::get('/success/{type}/{orderId}', [PaymentController::class, 'success'])
            ->name('success')
            ->whereIn('type', ['booking', 'membership']);

        Route::get('/failed', [PaymentController::class, 'failed'])
            ->name('payment.failed');
    });

});


Route::post('/midtrans/callback', [MidtransCallbackController::class, 'callback'])->name('midtrans.callback');

// Route::middleware(['auth:web'])->prefix('user')->name('user')->group(function () {
//     Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
//     Route::post('/cart/store', [CartController::class, 'store'])->name('cart.store');
//     Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
//     Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
// });



require __DIR__.'/auth.php';