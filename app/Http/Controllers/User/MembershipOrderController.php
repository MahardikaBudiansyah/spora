<?php
namespace App\Http\Controllers\User;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use App\Models\MembershipPackage;
use App\Enums\MembershipOrderStatus;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\VenueResource;
use App\Services\Billing\PaymentService;
use App\Http\Controllers\User\Controller;
use App\Http\Resources\MembershipCardResource;
use App\Http\Resources\MembershipPackageResource;
use App\Http\Requests\User\MembershipOrderStoreRequest;
use App\Services\Membership\MembershipOrderFlowService;
use App\Services\Membership\MembershipOrderPricingService;

class MembershipOrderController extends Controller
{
    protected $membershipOrderFlowService;
    protected $membershipOrderPricingService;
    protected $paymentService;

    public function __construct(
        MembershipOrderFlowService $membershipOrderFlowService,
        MembershipOrderPricingService $membershipOrderPricingService,
        PaymentService $paymentService
    ) {
        $this->membershipOrderFlowService = $membershipOrderFlowService;
        $this->membershipOrderPricingService = $membershipOrderPricingService;
        $this->paymentService = $paymentService;
        
    }
    
    public function create(Request $request)
    {
        $user = Auth::user();
        $packageId = session('selected_membership_package_id');

        if (!$packageId) {
            return redirect()->route('user.dashboard')->with('error', 'Silakan pilih paket membership terlebih dahulu.');
        }

        $package = MembershipPackage::with(['venue.paymentPolicies', 'venue.addresses', 'discounts', 'others'])
            ->findOrFail($packageId);
        $venueId = $package->venue_id;

        $membershipCard = MembershipCard::with([
            'user', 
            'venue',
            'orders' => function($query) {
                $query->whereIn('status', [
                    MembershipOrderStatus::ACTIVE->value, 
                    MembershipOrderStatus::QUEUED->value
                ])
                ->orderBy('start_date', 'asc');
            }
        ])
        ->where('user_id', $user->id)
        ->where('venue_id', $venueId)
        ->first();

        $summary = session('latest_membership_summary') 
            ?? $this->membershipOrderPricingService->getMembershipOrderSummary(
                $membershipCard ?? new MembershipCard(['user_id' => $user->id]), 
                $package
            );

        return Inertia::render('User/Orders/Membership/Create', [
            'user'       => $user,
            'membership' => $membershipCard ? new MembershipCardResource($membershipCard) : ['data' => null],
            'package'    => new MembershipPackageResource($package),
            'venue'      => new VenueResource($package->venue),
            'pricing'    => $summary, 
        ]);
    }

    public function calculate(Request $request)
    {
        try {
            $user = Auth::user();
            $package = MembershipPackage::findOrFail($request->package_id);
            $card = MembershipCard::where('user_id', $user->id)
                        ->where('venue_id', $package->venue_id)
                        ->first();

            $summary = $this->membershipOrderPricingService->getMembershipOrderSummary(
                $card ?? new MembershipCard(['user_id' => $user->id]), 
                $package,
                $request->payment_type
            );

            return redirect()->back()->with('latest_membership_summary', $summary);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'calculation' => 'Gagal menghitung ulang harga: ' . $e->getMessage()
            ]);
        }
    }

    public function store(MembershipOrderStoreRequest $request)
    {
        try {
            $validatedData = $request->validated();

            $result = $this->membershipOrderFlowService->handleOnlineMembershipOrder(
                Auth::id(),
                $validatedData,
                ['gateway_name' => config('services.payment.default')]
            );

            $gatewayData = $result['gateway_data'];
            $gatewayData['snap_token'] = $gatewayData['token'] ?? null;

            return redirect()->back()->with([
                'success'      => 'Pesanan berhasil dibuat.',
                'order_type'   => 'membership',
                'order_id'     => $result['order']->order_no,
                'gateway_data' => $gatewayData, 
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function selectPackages(Request $request) 
    {
        $request->validate([
            'package_id' => 'required|exists:membership_packages,id',
        ]);

        session(['selected_membership_package_id' => $request->package_id]);

        return redirect()->route('user.memberships.create');
    }

    public function getPaymentToken(MembershipOrder $membership) 
    {
        $ownerId = $membership->membershipCard?->user_id; 

        if ($ownerId !== auth()->id()) {
            return back()->withErrors(['message' => 'Akses ditolak.']);
        }

        $invoice = $membership->invoice; 
        
        $amountToPay = $invoice->total_amount - $invoice->payments()->where('payment_status', 'paid')->sum('amount');

        if ($amountToPay <= 0) {
            return back()->with('message', 'Tagihan ini sudah lunas.');
        }

        try {
            $userData = [
                'first_name' => auth()->user()->name,
                'email'      => auth()->user()->email,
                'phone'      => auth()->user()->phone_number,
            ];

            $result = $this->paymentService->createOnlineTransaction($invoice, $userData);

            return back()->with('flash', [
                'gateway_data' => $result,
                'snap_token' => $result['token'],
                'order_type' => 'membership'
            ]);

        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal mendapatkan token: ' . $e->getMessage()]);
        }
    }
}
