<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Models\MembershipOrder;
use App\Models\MembershipPackage;
use App\Http\Resources\TransactionResource;

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

        $query = Invoice::with(['payments.detail', 'order'])
            ->whereHasMorph('order', [Booking::class, MembershipOrder::class], function ($query, $type) use ($venue) {
                if ($type === Booking::class) {
                    $query->where('venue_id', $venue->id);
                }

                if ($type === MembershipOrder::class) {
                    $query->whereHas('membershipPackage', function ($q) use ($venue) {
                        $q->where('venue_id', $venue->id);
                    });
                }
            })
            ->latest();

        $totals = [
            'total_transactions' => (clone $query)->count(),
            'total_income'       => (clone $query)->where('status', 'paid')->sum('total_amount'),
            'total_unpaid'       => (clone $query)->where('status', 'unpaid')->sum('total_amount'),
        ];

        $invoices = $query->paginate(10)->withQueryString();

        return Inertia::render('Merchant/Venue/Transactions/Index', [
            'transactions' => TransactionResource::collection($invoices),
            'venue' => [
                'id'   => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'totals' => $totals,
        ]);
    }
}
