<?php

namespace App\Http\Controllers\User;

use App\Enums\MembershipOrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\User\BookingStoreRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\CheckoutItemResource;
use App\Http\Resources\MembershipCardResource;
use App\Http\Resources\VenueResource;
use App\Models\Booking;
use App\Models\Cart;
use App\Models\MembershipCard;
use App\Services\Billing\PaymentService;
use App\Services\Booking\BookingFlowService;
use App\Services\Booking\BookingPricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $bookingFlowService;
    protected $bookingPricingService;
    protected $paymentService;

    public function __construct(
        BookingFlowService $bookingFlowService,
        BookingPricingService $bookingPricingService,
        PaymentService $paymentService
    ) {
        $this->bookingFlowService = $bookingFlowService;
        $this->bookingPricingService = $bookingPricingService;
        $this->paymentService = $paymentService;
    }

    public function create(Request $request)
    {
        $user = Auth::user();

        $selectedIds = session('checkout_cart_ids', []);
        $venueIdFromSession = session('checkout_venue_id');

        if (empty($selectedIds)) {
            return redirect()->route('user.dashboard.index')->with('error', 'Sesi checkout berakhir.');
        }

        $allCarts = Cart::with(['venue.paymentPolicies', 'venue.addresses', 'court', 'timeSlot'])
            ->where('user_id', $user->id)
            ->whereIn('id', $selectedIds)
            ->get();

        if ($allCarts->isEmpty() && !session()->has('gateway_data')) {
            return redirect()->route('user.dashboard.index')->with('error', 'Item keranjang tidak ditemukan.');
        }

        $activeVenueId = (int) ($request->venue_id
            ?? $allCarts->first()?->venue_id
            ?? $venueIdFromSession);

        $details = $allCarts->map(function ($cart) {
            return [
                'cart_id'        => $cart->id,
                'court_id'       => $cart->court_id,
                'court_name'     => $cart->court->name,
                'start_time'     => $cart->timeSlot->start_time,
                'end_time'       => $cart->timeSlot->end_time,
                'booking_date'   => $cart->date,
                'original_price' => $cart->price,
            ];
        })->toArray();

        $summary = session('latest_summary');

        if (!$summary && $allCarts->isNotEmpty()) {
            $summary = $this->bookingPricingService->getBookingSummary(
                $details,
                $user->phone_number,
                $activeVenueId,
                'full_payment'
            );
        }

        $membershipCard = MembershipCard::with([
            'user',
            'orders' => function ($query) {
                $query->whereIn('status', [
                    MembershipOrderStatus::ACTIVE->value,
                    MembershipOrderStatus::QUEUED->value
                ])
                    ->orderBy('start_date', 'asc');
            }
        ])
            ->where('user_id', $user->id)
            ->where('venue_id', $activeVenueId)
            ->first();

        return Inertia::render('User/Orders/Booking/Create', [
            'user'       => $user,
            'membership' => $membershipCard ? new MembershipCardResource($membershipCard) : ['data' => null],
            'items'      => CheckoutItemResource::collection($allCarts)->additional(['pricing' => $summary]),
            'carts'      => new CartResource($allCarts),
            'venue'      => $allCarts->first()
                ? new VenueResource($allCarts->first()->venue)
                : null,
        ]);
    }

    public function calculate(Request $request)
    {
        try {
            $user = Auth::user();

            $summary = $this->bookingPricingService->getBookingSummary(
                $request->input('details', []),
                $user->phone_number,
                (int) $request->input('venue_id'),
                $request->input('payment_type', 'full_payment')
            );

            return redirect()->back()->with('latest_summary', $summary);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'calculation' => 'Gagal menghitung ulang harga: ' . $e->getMessage()
            ]);
        }
    }

    public function store(BookingStoreRequest $request)
    {
        try {
            $validatedData = $request->validated();

            $result = $this->bookingFlowService->handleOnlineBooking(
                Auth::id(),
                $validatedData,
                ['gateway_name' => config('services.payment.default')]
            );

            $gatewayData = $result['gateway_data'];
            $gatewayData['snap_token'] = $gatewayData['token'] ?? null;

            Log::info('[STORE_RESPONSE_DEBUG]', [
                'flash' => session()->all(),
                'gateway_data' => $gatewayData ?? null,
            ]);

            return redirect()->back()->with([
                'success'       => 'Pesanan berhasil dibuat.',
                'order_type'    => 'booking',
                'order_id'      => $result['order']->order_no,
                'gateway_data' => $gatewayData,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function prepareCheckout(Request $request)
    {
        $request->validate([
            'venue_id' => 'required',
            'ids' => 'required|array',
        ]);

        session([
            'checkout_venue_id' => $request->venue_id,
            'checkout_cart_ids' => $request->ids,
        ]);

        return redirect()->route('user.bookings.create');
    }

    public function getPaymentToken(Booking $booking)
    {
        // $booking->loadMissing(['customer', 'invoice.payments']);

        $ownerId = $booking->customer?->user_id;

        if ($ownerId !== auth()->id()) {
            return back()->withErrors(['message' => 'Bukan pesanan Anda.']);
        }

        $invoice = $booking->invoice;
        if (!$invoice) {
            return back()->withErrors(['message' => 'Invoice tidak ditemukan.']);
        }

        $totalPaid = (float) $invoice->payments()
            ->where('payment_status', PaymentStatus::PAID)
            ->sum('amount');

        $amountToPay = (float) $invoice->total_amount - $totalPaid;

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
                'order_type' => 'booking'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal mendapatkan token: ' . $e->getMessage()]);
        }
    }
}
