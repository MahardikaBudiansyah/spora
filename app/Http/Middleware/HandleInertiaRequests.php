<?php

namespace App\Http\Middleware;

use Log;
use Inertia\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => fn () => auth('web')->user(),

                'merchant' => fn () => tap(auth('merchant')->user(), function ($merchant) {
                    if ($merchant) {
                        $venues = $merchant->venues()->with('fields')->get();
                        $merchant->setRelation('venues', $venues);
                    }
                }),

                'admin' => fn () => auth('admin')->user(),
                
                'staff' => fn () => auth('staff')->user(),
            ],

            'prefill' => session()->only(['registered_email']),
        ];
    }
}
