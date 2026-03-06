<?php

namespace App\Http\Controllers\Merchant;

use Exception;
use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\MembershipCardResource;
use Illuminate\Validation\ValidationException;
use App\Services\Membership\MembershipCardService;
use App\Http\Requests\Merchant\MembershipCardStoreRequest;
use App\Http\Requests\Merchant\MembershipCardUpdateRequest;

class VenueMembershipCardController extends Controller
{
    protected MembershipCardService $cardService;

    public function __construct(MembershipCardService $cardService)
    {
        $this->cardService = $cardService;
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue); 
        $this->authorize('viewAny', MembershipCard::class);

        $membershipCards = $this->cardService->getCardsByVenue(
            venueId: $venue->id,
            filters: $request->only(['search']),
            perPage: 15,
            relations: [
                'user', 
                'latestOrder.membershipPackage'
            ]
        );

        return Inertia::render('Merchant/Venue/Membership/MembershipCards/Index', [
            'venue' => $venue, 
            'membershipCards' => MembershipCardResource::collection($membershipCards), 
            'filters' => $request->only(['search']),
        ]); 
    }

    public function store(MembershipCardStoreRequest $request, Venue $venue)
    {
        $this->authorize('create', [MembershipCard::class, $venue]);
        
        try {
            $data = array_merge($request->validated(), ['venue_id' => $venue->id]);
            $card = $this->cardService->createCardForCustomer($data);

            return back()->with('success', "Kartu Member '{$card->member_no}' berhasil dibuat.");
        } catch (Exception $e) {
            Log::error("VenueMembershipCard Store Error: " . $e->getMessage());
            return back()->with('error', 'Gagal membuat kartu member: ' . $e->getMessage());
        }
    }

    public function update(MembershipCardUpdateRequest $request, Venue $venue, MembershipCard $membershipCard)
    {
        $this->authorize('update', $membershipCard); 

        if ($membershipCard->venue_id !== $venue->id) {
            return back()->with('error', 'Aksi tidak diizinkan. Kartu tidak terdaftar di venue ini.');
        }

        try {
            $this->cardService->updateCard($membershipCard, $request->validated());
            return back()->with('success', "Data Kartu Member '{$membershipCard->member_no}' berhasil diperbarui.");
        } catch (Exception $e) {
            Log::error("VenueMembershipCard Update Error (ID: {$membershipCard->id}): " . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui data kartu member.');
        }
    }

    public function toggleActive(Request $request, Venue $venue, MembershipCard $membershipCard)
    {
        $this->authorize('toggleActive', $membershipCard); 
        
        if ($membershipCard->venue_id !== $venue->id) {
            return back()->with('error', 'Aksi tidak diizinkan. Kartu tidak cocok dengan venue.');
        }

        try {
            $updatedCard = $this->cardService->toggleCardStatus($membershipCard);
            
            return back()->with('success', 
                "Status Kartu '{$updatedCard->member_no}' berhasil " . 
                ($updatedCard->is_active ? 'diaktifkan' : 'dinonaktifkan')
            );
        } catch (Exception $e) {
            Log::error("VenueMembershipCard Toggle Error (ID: {$membershipCard->id}): " . $e->getMessage());
            return back()->with('error', 'Gagal mengubah status keaktifan kartu.');
        }
    }

    public function destroy(Venue $venue, MembershipCard $membershipCard)
    {
        $this->authorize('delete', $membershipCard); 

        if ($membershipCard->venue_id !== $venue->id) {
            return back()->with('error', 'Aksi tidak diizinkan. Kartu bukan milik venue ini.');
        }

        try {
            $memberNo = $membershipCard->member_no;
            
            $this->cardService->deleteCard($membershipCard);
            
            return back()->with('success', "Kartu Member '{$memberNo}' berhasil dihapus.");

        } catch (ValidationException $e) {
            return back()->with('error', $e->getMessage());

        } catch (Exception $e) {
            Log::error("VenueMembershipCard Destroy Error (ID: {$membershipCard->id}): " . $e->getMessage());
            return back()->with('error', 'Gagal menghapus kartu member.');
        }
    }
}