<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;

class TransactionController extends Controller
{
    protected function authorizeVenue(Venue $venue)
    {
        if ($venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke venue ini.');
        }
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);

        $transactions = Invoice::with(['payments', 'payments.detail', 'order'])
            ->whereHasMorph('order', [Booking::class, Membership::class], function ($query, $type) use ($venue) {
                if ($type === Booking::class) {
                    $query->where('venue_id', $venue->id);
                }

                if ($type === Membership::class) {
                    $query->whereHas('membershipPackage', function ($q) use ($venue) {
                        $q->where('venue_id', $venue->id);
                    });
                }
            })
            ->latest();

        // Clone untuk hitung total
        $totalTransactions = (clone $transactions)->count();
        $totalIncome = (clone $transactions)->sum('total_amount');
        $totalUnpaid = (clone $transactions)->where('status', '!=', 'paid')->sum('total_amount');

        $transactions = $transactions->paginate(10)->withQueryString();

        // Transformasi data ringan untuk frontend
        $transactions->getCollection()->transform(function ($transaction) {
            return [
                'id' => $transaction->id,
                'invoice_no' => $transaction->invoice_no,
                'total_amount' => $transaction->total_amount,
                'status' => $transaction->status,
                'due_date' => $transaction->due_date,
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at,
                'order_type' => class_basename($transaction->order_type), // Booking / Membership
                'order_no' => $transaction->order->order_no ?? null, // bisa dari Booking atau Membership
            ];
        });

        return Inertia::render('Merchant/Venue/Transaction/Index', [
            'transactions' => $transactions,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'totals' => [
                'total_transactions' => $totalTransactions,
                'total_income' => $totalIncome,
                'total_unpaid' => $totalUnpaid,
            ],
        ]);
    }



}
