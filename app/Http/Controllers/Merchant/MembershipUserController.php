<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;


class MembershipUserController extends Controller
{    
    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        // Mulai query
        $query = $venue->membershipUsers()
            ->with([
                'user', 
                'memberships.membershipPackage' // history memberships beserta paket
            ])
            ->latest();

        // Filter search berdasarkan nama user atau member_no
        if ($search = $request->query('search')) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('member_no', 'like', "%{$search}%");
        }

        // Pagination 15 per halaman
        $membershipUsers = $query->paginate(15)->withQueryString();

        return Inertia::render('Merchant/Venue/Membership/Member/Index', [
            'venue' => $venue,
            'users' => $membershipUsers,
            'filters' => $request->only(['search']),
        ]);
    }

    



}
