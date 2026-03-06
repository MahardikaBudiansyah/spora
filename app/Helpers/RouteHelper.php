<?php

namespace App\Helpers;

class RouteHelper
{
    public static function getDashboardRouteByRole()
    {
        // Jika login, arahkan ke dashboard sesuai role
        if (auth('admin')->check()) {
            return route('admin.dashboard');
        }

        if (auth('merchant')->check()) {
            return route('merchant.dashboard');
        }

        if (auth('staff')->check()) {
            return route('staff.dashboard');
        }

        if (auth('web')->check()) {
            return route('home');
        }

        // Jika belum login, arahkan ke login sesuai guard (default ke home)
        if (request()->is('admin/*')) {
            return route('admin.login');
        }

        if (request()->is('merchant/*')) {
            return route('merchant.login');
        }

        if (request()->is('staff/*')) {
            return route('staff.login');
        }

        return route('home');
    }
}

