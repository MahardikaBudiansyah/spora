<?php

namespace App\Http\Controllers\Merchant;

use Log;
use Carbon\Carbon;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use App\Models\MembershipOrder;
use App\Models\MembershipPackage;
use App\Helpers\NumberPhoneHelper;
use App\Http\Resources\VenueResource;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Resources\MembershipOrderResource;
use App\Http\Resources\MembershipPackageResource;
use App\Services\Membership\MembershipOrderService;
use App\Services\Membership\MembershipOrderFlowService;
use App\Http\Requests\Merchant\MembershipOrderStoreRequest;


class VenueMembershipOrderController extends Controller
{
    protected MembershipOrderFlowService $flowService;
    protected MembershipOrderService $orderService;

    public function __construct(
        MembershipOrderFlowService $flowService,
        MembershipOrderService $orderService
    )
    {
        $this->flowService = $flowService;
        $this->orderService = $orderService;
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);
        $this->authorize('viewAny', MembershipOrder::class);
        
        $orders = $this->orderService->getAllByVenue($venue->id); 

        return Inertia::render('Merchant/Venue/Membership/MembershipOrders/Index', [
            'venue' => [
                'id' => $venue->id,
                'slug' => $venue->slug,
                'name' => $venue->name,
            ],
            'membershipOrders' => MembershipOrderResource::collection($orders),
        ]);
    }

    public function create(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);
        $this->authorize('create', MembershipOrder::class);

        $merchant = $request->user('merchant');
        $venue = $merchant->venues()
                ->where('id', $venue->id)
                ->firstOrFail();

        return Inertia::render('Merchant/Venue/Membership/MembershipOrders/Create', [ 
            'merchant' => $merchant->only('id', 'name'),
            'venue'    => new VenueResource($venue->loadMissing(['addresses.village', 'addresses.district', 'addresses.city', 'addresses.province', 'paymentPolicies'])),
            'membershipPackages' => MembershipPackageResource::collection(MembershipPackage::activeForVenue($venue->id)->get()),
        ]);
    }

    public function store(MembershipOrderStoreRequest $request, Venue $venue)
    {
        $validated = $request->validated();

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
                ->route('merchant.venues.memberships.orders.index', $venue->slug)
                ->with('success', 'Order membership berhasil disimpan.');

        } catch (\Exception $e) {
            Log::error('[MEMBERSHIP_STORE_ERROR]', ['message' => $e->getMessage()]);
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

}

