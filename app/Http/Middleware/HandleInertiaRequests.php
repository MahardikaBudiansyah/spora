<?php

namespace App\Http\Middleware;

use App\Http\Resources\NotificationResource;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Inertia\Middleware;

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
                'user' => fn() => auth('web')->user(),
                'admin' => fn() => auth('admin')->user(),
                'merchant' => function () {
                    $merchant = auth('merchant')->user();

                    if ($merchant instanceof Merchant) {
                        return $merchant->load('venues');
                    }

                    return null;
                },
                'staff' => fn() => auth('staff')->user(),
            ],
            'prefill' => session()->only(['registered_email']),
            'flash' => [
                'success'      => fn() => $request->session()->get('success'),
                'error'        => fn() => $request->session()->get('error'),
                'order_type'   => fn() => $request->session()->get('order_type'),
                'gateway_data' => fn() => $request->session()->get('gateway_data'),
            ],
            'notifications' => function () use ($request) {
                $user = $request->user();

                if (!$user) return [
                    'list' => [],
                    'unread_count' => 0
                ];

                $latestNotifications = $user->notifications()
                    ->latest()
                    ->limit(10)
                    ->get();

                return [
                    'list' => NotificationResource::collection($latestNotifications),
                    'unread_count' => $user->unreadNotifications()->count(),
                ];
            },
        ];
    }
}
