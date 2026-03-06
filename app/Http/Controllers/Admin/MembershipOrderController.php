<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\MembershipOrder;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class MembershipOrderController extends Controller
{
    public function index(Request $request)
    {
        $memberships = MembershipOrder::with([
            'membershipPackage', 
            'membershipPackage.venue', 
            'membershipCard', 
            'membershipCard.user', 
            'invoice',
        ])
        ->orderBy('created_at', 'asc')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/MembershipOrders/Index', [
            'memberships' => $memberships,
        ]);
    }

    public function show(Request $request)
    {
      
    }


}