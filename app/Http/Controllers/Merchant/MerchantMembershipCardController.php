<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\MembershipCardStoreRequest;
use App\Http\Requests\Merchant\MembershipCardUpdateRequest;
use App\Http\Resources\MembershipCardResource;
use App\Models\MembershipCard;
use App\Models\Venue;
use App\Services\Membership\MembershipCardService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MerchantMembershipCardController extends Controller
{
    protected MembershipCardService $cardService;

    public function __construct(MembershipCardService $cardService)
    {
        $this->cardService = $cardService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', MembershipCard::class);

        $merchant = $request->user('merchant');

        $cards = $this->cardService->getCardsByMerchant(
            merchantId: $merchant->id,
            filters: $request->only(['search']),
            perPage: 15,
            relations: [
                'user',
                'venue',
                'latestOrder.membershipPackage'
            ]
        );

        return Inertia::render('Merchant/Membership/MembershipCards/Index', [
            'merchant' => [
                'name' => $merchant->name,
            ],
            'membershipCards' => MembershipCardResource::collection($cards),
            'venues' => $merchant->venues()->select('id', 'name')->get(),
            'can_create' => auth('merchant')->user()->status === MerchantStatus::APPROVED,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(MembershipCardStoreRequest $request)
    {
        $this->authorize('create', MembershipCard::class);

        try {
            $data = $request->validated();
            $venue = Venue::findOrFail($data['venue_id']);

            $this->authorize('create', [MembershipCard::class, $venue]);

            $card = $this->cardService->createCardForCustomer($data);

            return back()->with('success', "Kartu Member '{$card->member_no}' berhasil dibuat.");
        } catch (Exception $e) {
            Log::error("Error creating Membership Card: " . $e->getMessage());
            return back()->with('error', 'Gagal membuat kartu member. ' . $e->getMessage());
        }
    }

    public function update(MembershipCardUpdateRequest $request, MembershipCard $membershipCard)
    {
        $this->authorize('update', $membershipCard);

        try {
            $this->cardService->updateCard($membershipCard, $request->validated());
            return back()->with('success', "Data kartu member berhasil diperbarui.");
        } catch (Exception $e) {
            Log::error("Error updating Membership Card ID {$membershipCard->id}: " . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui data kartu member.');
        }
    }

    public function toggleActive(Request $request, MembershipCard $membershipCard)
    {
        $this->authorize('toggleActive', $membershipCard);

        try {
            $updatedCard = $this->cardService->toggleCardStatus($membershipCard);

            return back()->with(
                'success',
                "Status Kartu Member '{$updatedCard->member_no}' berhasil " .
                    ($updatedCard->is_active ? 'diaktifkan' : 'dinonaktifkan')
            );
        } catch (Exception $e) {
            Log::error("Error toggling Card: " . $e->getMessage());
            return back()->with('error', 'Gagal mengubah status kartu member.');
        }
    }

    public function destroy(MembershipCard $membershipCard)
    {
        $this->authorize('delete', $membershipCard);

        try {
            $memberNo = $membershipCard->member_no;
            $this->cardService->deleteCard($membershipCard);

            return back()->with('success', "Kartu Member '{$memberNo}' berhasil dihapus.");
        } catch (Exception $e) {
            Log::error("Error deleting Membership Card ID {$membershipCard->id}: " . $e->getMessage());
            return back()->with('error', 'Gagal menghapus kartu member.');
        }
    }
}
