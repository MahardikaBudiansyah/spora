<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Enums\VenueStatus;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\VenueStoreRequest;
use App\Http\Requests\Merchant\VenueUpdateRequest;
use App\Http\Resources\VenueResource;
use App\Models\Admin;
use App\Models\Venue;
use App\Models\VenueCategory;
use App\Models\VenueFacility;
use App\Notifications\Admin\VenueVerificationRequestNotification;
use App\Services\Venue\VenueService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VenueController extends Controller
{

    public function __construct()
    {
        $this->authorizeResource(Venue::class, 'venue');
    }

    public function index(Request $request)
    {
        $merchant = auth('merchant')->user();

        $venues = Venue::with([
            'courts',
            'address.village',
            'address.district',
            'address.city',
            'address.province',
            'categories',
        ])
            ->withAvg('reviews', 'venue_rating')
            ->where('merchant_id', $merchant->id)
            ->oldest()
            ->paginate(10);


        $isMerchantApproved = $merchant->status === MerchantStatus::APPROVED;
        $hasApprovedVenue = Venue::where('merchant_id', $merchant->id)
            ->where('status', VenueStatus::APPROVED)
            ->exists();

        return Inertia::render('Merchant/Venue/Index', [
            'merchant' => [
                'name' => $merchant->name,
            ],
            'venues' => VenueResource::collection($venues)->response()->getData(true),
            'auth_status' => [
                'is_merchant_approved' => $isMerchantApproved,
                'has_approved_venue' => $hasApprovedVenue,
                'can_create' => $isMerchantApproved && $hasApprovedVenue
            ]
        ]);
    }

    public function create()
    {
        $merchant = auth('merchant')->user();

        if ($merchant->status !== MerchantStatus::APPROVED) {
            return redirect()
                ->route('merchant.dashboard')
                ->with('error', 'Akun Anda masih dalam proses verifikasi...');
        }

        $venue_categories = VenueCategory::orderBy('id')->get(['id', 'name', 'label']);
        $facilities = VenueFacility::orderBy('id')->get(['id', 'name', 'icon']);

        return Inertia::render('Merchant/Venue/Create', [
            'merchant' => [
                'name' => $merchant->name,
            ],
            'venue_categories' => $venue_categories,
            'facilities' => $facilities,
        ]);
    }

    public function store(VenueStoreRequest $request, VenueService $venueService)
    {
        try {
            Log::info('Store Venue Attempt', [
                'merchant_id' => auth('merchant')->id(),
                'data' => $request->except(['images']),
                'has_files' => $request->hasFile('images'),
                'file_count' => count($request->file('images', []))
            ]);

            $venueService->createVenue(
                $request->validated(),
                auth('merchant')->id(),
                $request
            );

            return redirect()->route('merchant.venues.index')->with('success', 'Venue berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('Store Venue Failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'Gagal menambahkan venue: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function show(Venue $venue)
    {
        $venue->load([
            'courts.surface',
            'courts.featuredImage',
            'images',
            'facilities',
            'categories',
            'socialMedia',
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
            'membershipPackages.discounts',
            'membershipPackages.others',
            'paymentPolicies'
        ])->loadAvg('reviews', 'venue_rating')->loadCount('reviews');

        return Inertia::render('Merchant/Venue/Show', [
            'venue' => new VenueResource($venue),
        ]);
    }

    public function edit(Venue $venue)
    {
        $venue->load([
            'categories',
            'facilities',
            'images' => fn($q) => $q->orderBy('order'),
            'addresses.province',
            'addresses.city',
            'addresses.district',
            'addresses.village',
        ]);

        return Inertia::render('Merchant/Venue/Edit', [
            'merchant' => $venue->merchant,
            'venue' => new VenueResource($venue),
            'venue_categories' => VenueCategory::orderBy('id')->get(['id', 'name', 'label']),
            'facilities' => VenueFacility::orderBy('id')->get(['id', 'name', 'icon']),
        ]);
    }

    public function update(VenueUpdateRequest $request, Venue $venue, VenueService $venueService)
    {
        try {
            Log::info('Update Venue Attempt', [
                'venue_id' => $venue->id,
                'existing_ids' => $request->input('existing_image_ids'),
                'new_files_count' => count($request->file('images', []))
            ]);

            $venueService->updateVenue($venue, $request->validated(), $request);
            Log::info('Files Received:', [
                'count' => count($request->file('images', [])),
                'ids' => $request->input('existing_image_ids')
            ]);

            return redirect()->route('merchant.venues.index')->with('success', 'Venue berhasil diperbarui');
        } catch (\Exception $e) {
            Log::error('Update Venue Failed: ' . $e->getMessage(), [
                'venue_id' => $venue->id,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'Gagal memperbarui venue: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function requestVerification(Request $request, Venue $venue)
    {
        $request->validate([
            'reason' => [
                'nullable',
                'string',
                'sometimes',
                'min:10',
                'max:500'
            ],
        ]);

        $merchant = Auth::guard('merchant')->user();

        if ($venue->merchant_id !== $merchant->id) {
            return back()->withErrors(['message' => 'Data Venue tidak ditemukan.']);
        }

        if (empty($venue->name) || empty($venue->phone_number)) {
            return back()->withErrors(['message' => 'Lengkapi data venue sebelum mengajukan verifikasi.']);
        }

        $address = $venue->address;

        if (!$address || empty($address->address) || empty($address->province_code) || empty($address->city_code) || empty($address->district_code) || empty($address->village_code) || empty($address->postal_code)) {
            return back()->withErrors([
                'message' => 'Lengkapi alamat lengkap lokasi venue sebelum mengajukan verifikasi.'
            ]);
        }

        if ($venue->status !== VenueStatus::DRAFT && $venue->status !== VenueStatus::REJECTED) {
            return back()->withErrors(['message' => 'Data ini sudah dalam proses verifikasi atau sudah disetujui.']);
        }

        $admins = Admin::all();

        try {
            DB::transaction(function () use ($admins, $merchant, $venue) {
                $venue->update([
                    'status' => VenueStatus::PENDING
                ]);

                foreach ($admins as $admin) {
                    $admin->notify(new VenueVerificationRequestNotification($merchant, $venue));
                }
            });

            return back()->with('success', 'Verifikasi venue berhasil diajukan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }


    public function destroy(Venue $venue, VenueService $venueService)
    {
        try {
            $venueService->deleteVenue($venue);
            return redirect()->route('merchant.venues.index')->with('success', 'Venue berhasil dihapus!');
        } catch (QueryException $e) {
            Log::warning("Mitra gagal menghapus venue karena relasi database", [
                'venue_id' => $venue->id,
                'error' => $e->getMessage()
            ]);
            return back()->with('error', 'Venue tidak bisa dihapus karena masih memiliki data lapangan atau transaksi.');
        } catch (Exception $e) {
            Log::error("Gagal hapus venue (General Error)", ['error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan sistem. Silakan coba lagi nanti.');
        }
    }
}
