<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Invoice::with([
            'order', 'payments'
        ]) 
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

}