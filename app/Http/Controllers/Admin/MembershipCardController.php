<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use App\Http\Controllers\Admin\Controller;
use App\Services\Membership\MembershipCardService;
use App\Http\Resources\MembershipCardResource;

class MembershipCardController extends Controller
{
    protected MembershipCardService $cardService;

    public function __construct(MembershipCardService $cardService)
    {
        $this->cardService = $cardService;
        $this->middleware('can:viewAny,' . MembershipCard::class);
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', MembershipCard::class);

        $query = MembershipCard::query()
            ->with([
                'user',
                'venue:id,name,slug',
                'latestOrder.membershipPackage'
            ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('member_no', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $membershipCards = $query->latest()
            ->paginate(10);

        return Inertia::render('Admin/MembershipCards/Index', [
            'membershipCards' => MembershipCardResource::collection($membershipCards),
            'filters' => $request->only(['search']),
        ]);
    }

    public function toggleActive(MembershipCard $membershipCard, Request $request)
    {
        $this->authorize('update', $membershipCard);

        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $membershipCard->is_active = $request->is_active;
        $membershipCard->save();

        return back()->with('success', 'Status Kartu Member berhasil diperbarui.');
    }


    public function destroy(MembershipCard $membershipCard)
    {
        $this->authorize('delete', $membershipCard);

        $membershipCard->delete();

        return back()->with('success', 'Data Kartu Member berhasil dihapus.');
    }
}
