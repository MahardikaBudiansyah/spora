<?php

namespace App\Providers;

use App\Models\Court;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/';
    public const USER_HOME = '/user/dashboard';
    public const MERCHANT_HOME = '/merchant/dashboard';
    public const STAFF_HOME = '/staff/dashboard';
    public const ADMIN_HOME = '/admin/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        parent::boot(); 
        
        Route::bind('venue', function ($value) {
            return Venue::where('slug', $value)->firstOrFail();
        });

        Route::bind('court', function ($value) {
            return Court::where('slug', $value)->firstOrFail();
        });

        Route::bind('package', function ($value, $route) {
            return MembershipPackage::where('slug', $value)->firstOrFail();
        });

        Route::bind('package', function ($value, $route) {
            $venue = $route->parameter('venue');
            return $venue->membershipPackages()->where('slug', $value)->firstOrFail();
        });

        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('web')
                ->group(base_path('routes/merchant.php')); 

            Route::middleware('web')
                ->group(base_path('routes/staff.php'));
        });
    }


    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
