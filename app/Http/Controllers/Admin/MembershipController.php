<?php

namespace App\Http\Controllers\Admin;

use Log;
use Inertia\Inertia;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class MembershipController extends Controller
{
    public function index(Request $request)
    {
        $memberships = Membership::with([
            'membershipPackage', 
            'membershipPackage.venue', 
            'membershipUser', 
            'membershipUser.user', 
            'invoice',
        ])
        ->orderBy('created_at', 'asc')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Memberships/Index', [
            'memberships' => $memberships,
        ]);
    }


}