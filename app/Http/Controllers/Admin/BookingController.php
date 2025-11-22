<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['venue', 'customer', 'invoice'])
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }


}