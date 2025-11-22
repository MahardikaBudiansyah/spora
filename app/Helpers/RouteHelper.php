<?php

namespace App\Helpers;

class RouteHelper
{
    public static function getDashboardRouteByRole()
    {
        if (auth('admin')->check()) {
            return route('admin.dashboard');
        }

        if (auth('merchant')->check()) {
            return route('merchant.dashboard');
        }

        if (auth('staff')->check()) {
            return route('staff.dashboard');
        }

        // default: user
        if (auth('web')->check()) {
            return route('home');
        }

        // fallback kalau tidak login
        return route('home');
    }
}
