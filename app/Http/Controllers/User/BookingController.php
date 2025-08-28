<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BookingController extends Controller
{

    public function create(Request $request)   
    {
        return Inertia::render('User/Booking/Create');
    }
}