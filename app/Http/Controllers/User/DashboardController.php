<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Contoh validasi sederhana: name dan phone harus terisi
        $profileIncomplete = empty($user->name) || empty($user->phone_number);

        return Inertia::render('User/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'profileIncomplete' => $profileIncomplete,
            // Data dashboard lain, misalnya:
            // 'memberships' => [],
            // 'bookings' => [],
        ]);
    }
}
