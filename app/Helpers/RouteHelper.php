<?php
// app/Helpers/RouteHelper.php

namespace App\Helpers;

class RouteHelper
{
    public static function getDashboardRouteByRole($guard = null)
    {
        switch ($guard ?? auth()->getDefaultDriver()) {
            case 'merchant':
                return route('merchant.dashboard');
            case 'staff':
                return route('staff.dashboard');
            case 'admin':
                return route('admin.dashboard');
            default:
                return route('user.dashboard');
        }
    }
}
