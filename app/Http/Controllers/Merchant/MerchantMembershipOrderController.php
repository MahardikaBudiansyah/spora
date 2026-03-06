<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\MembershipOrderStoreRequest;
use App\Http\Resources\MembershipOrderResource;
use App\Http\Resources\MembershipPackageResource;
use App\Http\Resources\VenueResource;
use App\Models\MembershipOrder;
use App\Models\MembershipPackage;
use App\Services\Membership\MembershipCardService;
use App\Services\Membership\MembershipOrderFlowService;
use App\Services\Membership\MembershipOrderService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MerchantMembershipOrderController extends Controller
{
    protected MembershipOrderFlowService $flowService;
    protected MembershipCardService $cardService;
    protected MembershipOrderService $orderService;

    public function __construct(
        MembershipOrderFlowService $flowService,
        MembershipCardService $cardService,
        MembershipOrderService $orderService,
    ) {
        $this->flowService = $flowService;
        $this->cardService = $cardService;
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', MembershipOrder::class);

        $merchant = $request->user('merchant');
        $orders = $this->orderService->getAllByMerchant($merchant->id, 10);

        return Inertia::render('Merchant/Membership/MembershipOrders/Index', [
            'merchant' => [
                'id' => $merchant->id,
                'name' => $merchant->name,
            ],
            'membershipOrders' => MembershipOrderResource::collection($orders),
            'can_create' => auth('merchant')->user()->status === MerchantStatus::APPROVED,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', MembershipOrder::class);

        $merchant = $request->user('merchant');

        return Inertia::render('Merchant/Membership/MembershipOrders/Create', [
            'merchant' => $merchant->only('id', 'name'),
            'venues'   => VenueResource::collection($merchant->venuesWithAddresses()->with(['paymentPolicies'])->get()),
            'membershipPackages' => [],
        ]);
    }

    public function store(MembershipOrderStoreRequest $request)
    {
        $validated = $request->validated();
        $merchant = $request->user('merchant');

        $venue = $merchant->venues()->findOrFail($validated['venue_id']);

        try {
            $this->flowService->validateAvailability(
                $venue->id,
                $validated['customer_id'] ?? null,
                Carbon::parse($validated['start_date'])
            );

            $this->flowService->handleOfflineMembershipOrder(
                input: $validated,
                venue: $venue,
                packageId: $validated['membership_package_id']
            );

            return redirect()
                ->route('merchant.memberships.orders.index')
                ->with('success', 'Pendaftaran membership berhasil diproses.');
        } catch (Exception $e) {
            Log::error('[MERCHANT_MEMBERSHIP_STORE_ERROR]', [
                'merchant_id' => $merchant->id,
                'message' => $e->getMessage()
            ]);
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function getPackages(Request $request)
    {
        $venueId = $request->query('venue_id');

        $exists = $request->user('merchant')->venues()->where('id', $venueId)->exists();

        if (!$exists) return response()->json([], 403);

        return MembershipPackageResource::collection(
            MembershipPackage::activeForVenue($venueId)->get()
        );
    }
}
