<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Admin;
use App\Models\Field;
use App\Models\Venue;
use App\Policies\AdminPolicy;
use App\Policies\FieldPolicy;
use App\Policies\VenuePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Admin::class => AdminPolicy::class,
        Venue::class => VenuePolicy::class,
        Field::class => FieldPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function ($user, $ability, $arguments) {
            if ($user instanceof Admin && in_array($ability, ['view', 'viewAny'])) {
                return true;
            }
        });

        
    }
}
