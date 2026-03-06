<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use App\Models\MembershipOrder;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BookingResource;
use App\Http\Resources\MembershipCardResource;
use App\Http\Resources\MembershipOrderResource;

class DashboardController extends Controller
{ 
    public function index() {
        return Inertia::render('User/Dashboard/Dashboard', [
            'profileIncomplete' => empty(Auth::user()->phone_number),
            // Data ringkasan dashboard jika ada
        ]);
    }

    public function memberships() {
        $userId = Auth::id();

        $membershipCards = MembershipCard::with([
            'venue.featuredImage'
        ])
        ->where('user_id', $userId)
        ->get();

        $membershipOrders = MembershipOrder::with([
            'venue.featuredImage', 
            'venue.images',
            'venue.addresses.village', 
            'venue.addresses.district', 
            'venue.addresses.city', 
            'venue.addresses.province',
            'invoice.payments.detail', 
            'membershipCard'
        ])
        ->whereHas('membershipCard', fn($q) => $q->where('user_id', $userId))
        ->latest()
        ->paginate(10);

        return Inertia::render('User/Dashboard/Memberships', [
            'membershipCards' => MembershipCardResource::collection($membershipCards),
            'membershipOrders' => MembershipOrderResource::collection($membershipOrders), 
        ]);
    }

    public function bookings() {
        $bookings = Booking::with([
            'venue.featuredImage', 
            'venue.images',
            'venue.addresses.village', 
            'venue.addresses.district', 
            'venue.addresses.city', 
            'venue.addresses.province',
            'invoice.payments.detail', 
            'details.court.images',
            'details.timeSlot', 
            'customers'
        ])
        ->whereHas('customers', fn($q) => $q->where('user_id', Auth::id()))
        ->latest()
        ->paginate(10);

        return Inertia::render('User/Dashboard/Bookings', [
            'bookings' => BookingResource::collection($bookings), 
        ]);
    }

    public function notifications(Request $request)
    {
        return Inertia::render('User/Dashboard/Notifications', [
           
        ]);
    }

}
