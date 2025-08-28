<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CartController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\User\VenueController;
use App\Http\Controllers\User\BookingController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\DashboardController;

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

Route::get('/venues', [VenueController::class, 'index'])->name('venues');
Route::get('/venues/{venue:slug}', [VenueController::class, 'show'])->name('show');
Route::get('/venues/{venue:slug}/timeslots', [TimeSlotController::class, 'getTimeslotsByVenue'])->name('getTimeslotsByVenue');


Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/dashboard', function () {
    return Inertia::render('User/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/dashboard1', function () {
//     return Inertia::render('User/Dashboard1');
// })->name('dashboard1');

Route::middleware(['auth', 'verified'])->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('carts')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/store', [CartController::class, 'store'])->name('store');
        Route::delete('/{cart}', [CartController::class, 'destroy'])->name('destroy');
        Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
    });

    Route::prefix('bookings')->name('booking.')->group(function () {
        // Route::get('/', [BookingController::class, 'index'])->name('index');
        Route::get('/create', [BookingController::class, 'create'])->name('create');
        // Route::post('/store', [BookingController::class, 'store'])->name('store');
    });
    // Middleware ini hanya untuk route lain
    Route::middleware(['ensure.profile.complete'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    });
});

// Route::middleware(['auth:web'])->prefix('user')->name('user')->group(function () {
//     Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
//     Route::post('/cart/store', [CartController::class, 'store'])->name('cart.store');
//     Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
//     Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
// });



require __DIR__.'/auth.php';