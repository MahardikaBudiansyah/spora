<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with([
            'detail', 'invoice.order'
            ])
        ->orderBy('created_at', 'asc')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
        ]);
    }

}