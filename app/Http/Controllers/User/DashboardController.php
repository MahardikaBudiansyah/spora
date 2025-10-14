<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $profileIncomplete = empty($user->name) || empty($user->phone_number);

        $memberships = Membership::with([
            'membershipUser',        
            'membershipPackage',
            'membershipPackage.discounts',
            'membershipPackage.others',
            'membershipPackage.venue',
            'invoice',
            'invoice.payments',
            'invoice.payments.detail',
        ])
        ->whereHas('membershipUser', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->orderByDesc('start_date')
        ->paginate(5);


        // Bookings (pakai pagination juga)
        $bookings = Booking::with([
            'venue',
            'venue.featuredImage',
            'customers',
            'details.field',
            'details.timeSlot',
            'invoice',
            'invoice.payments',
            'invoice.payments.detail'
        ])
        ->whereHas('customers', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('phone_number', $user->phone_number);
        })
        ->orderByDesc('created_at')
        ->paginate(3); // ✅ pagination

        return Inertia::render('User/Dashboard/Dashboard', [
            'auth' => ['user' => $user],
            'profileIncomplete' => $profileIncomplete,
            'memberships' => $memberships,
            'bookings' => $bookings,
        ]);
    }

}
