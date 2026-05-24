<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Resources\MerchantResource;
use App\Http\Resources\VenueResource;
use App\Models\Booking;
use App\Models\CourtSchedule;
use App\Models\Venue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $merchant = $request->user();
        $merchant->load([
            'statusHistories',
            'latestStatusHistory',
            'owner.latestStatusHistory',
            'owner.address.province',
            'owner.address.city',
            'owner.address.district',
            'owner.address.village',
            'ownerSubmission.latestStatusHistory',
            'ownerSubmission.address.province',
            'ownerSubmission.address.city',
            'ownerSubmission.address.district',
            'ownerSubmission.address.village',
            'profile.latestStatusHistory',
            'profile.address.province',
            'profile.address.city',
            'profile.address.district',
            'profile.address.village',
            'profileSubmission.latestStatusHistory',
            'profileSubmission.address.province',
            'profileSubmission.address.city',
            'profileSubmission.address.district',
            'profileSubmission.address.village',
            'payoutMethods.latestStatusHistory',
            'payoutMethodSubmissions.latestStatusHistory',
            'socialMedia',
        ]);

        $venues = Venue::where('merchant_id', $merchant->id)
            ->with([
                'courts' => function ($query) {
                    $query->select('id', 'venue_id', 'court_surface_id', 'name', 'slug');
                },
                'courts.surface',
                'address.province',
                'address.city',
                'address.district',
                'address.village'
            ])
            ->latest()
            ->get();

        $today = Carbon::today();

        $todayBookings = Booking::whereHas('details.court.venue', function ($q) use ($merchant) {
            $q->where('merchant_id', $merchant->id);
        })
            ->whereDate('created_at', $today) // ⚠️ ini juga aku perbaiki
            ->count();

        $todayRevenue = Booking::whereHas('details.court.venue', function ($q) use ($merchant) {
            $q->where('merchant_id', $merchant->id);
        })
            ->whereDate('created_at', $today)
            ->sum('total_price');

        $schedulesToday = CourtSchedule::whereHas('court.venue', function ($q) use ($merchant) {
            $q->where('merchant_id', $merchant->id);
        })
            ->whereDate('date', $today)
            ->get();

        $filledSlots = CourtSchedule::whereHas('court.venue', function ($q) use ($merchant) {
            $q->where('merchant_id', $merchant->id);
        })
            ->whereDate('date', $today)
            ->whereHas('statusType', function ($q) {
                $q->whereIn('label', ['Booked', 'Dipesan']);
            })
            ->count();

        $availableSlots = $schedulesToday
            ->filter(fn($s) => optional($s->statusType)->label === 'Tersedia')
            ->count();


        return Inertia::render('Merchant/Dashboard', [
            'stats' => [
                'todayBookings' => $todayBookings,
                'todayRevenue' => 'Rp ' . number_format($todayRevenue, 0, ',', '.'),
                'filledSlots' => $filledSlots,
                'availableSlots' => $availableSlots,
            ],
            'merchant' => new MerchantResource($merchant),
            'venues' => VenueResource::collection($venues),
        ]);
    }
}
