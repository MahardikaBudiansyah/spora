<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Enums\VenueStatus;
use App\Http\Requests\Merchant\MerchantMembershipPackageRequest;
use App\Http\Resources\VenueResource;
use App\Models\MembershipPackage;
use App\Models\Venue;
use App\Services\Membership\MembershipPackageService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MerchantMembershipPackageController extends Controller
{
    protected $service;

    public function __construct(MembershipPackageService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', MembershipPackage::class);

        $merchant = auth('merchant')->user();

        $venues = $this->service->getPackagesByMerchant($merchant->id);

        $isMerchantApproved = $merchant->status === MerchantStatus::APPROVED;
        $hasApprovedVenue = $venues->contains(fn($v) => $v->status === VenueStatus::APPROVED);

        return Inertia::render('Merchant/Membership/MembershipPackages/Index', [
            'merchant' => [
                'name' => $merchant->name,
            ],
            'venues' => VenueResource::collection($venues),
            'auth_status' => [
                'is_merchant_approved' => $isMerchantApproved,
                'has_approved_venue' => $hasApprovedVenue,
                'can_create' => $isMerchantApproved && $hasApprovedVenue
            ]
        ]);
    }

    public function store(MerchantMembershipPackageRequest $request)
    {
        $this->authorize('create', MembershipPackage::class);

        try {
            $data = $request->validated();

            $venue = Venue::findOrFail($data['venue_id']);

            $this->authorize('create', [MembershipPackage::class, $venue]);

            $this->service->createPackage($data);

            return back()->with('success', 'Paket membership berhasil ditambahkan!');
        } catch (AuthorizationException $e) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menambah paket di venue ini.');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Venue tidak ditemukan.');
        } catch (\Exception $e) {
            \Log::error("Gagal membuat paket membership: " . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan sistem saat membuat paket.');
        }
    }

    public function update(MerchantMembershipPackageRequest $request, MembershipPackage $membershipPackage)
    {
        $this->authorize('update', $membershipPackage);

        try {
            $this->service->updatePackage($membershipPackage, $request->validated());

            return back()->with('success', 'Paket membership berhasil diperbarui!');
        } catch (\Exception $e) {
            \Log::error("Error update global package: " . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui paket.');
        }
    }

    public function toggleActive(MembershipPackage $membershipPackage, Request $request)
    {
        $this->authorize('toggleActive', $membershipPackage);

        try {
            $this->service->togglePackageStatus($membershipPackage, $request->is_active);

            return response()->json([
                'success' => true,
                'message' => 'Status paket membership berhasil diperbarui',
                'is_active' => $membershipPackage->is_active,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }

    public function destroy(MembershipPackage $membershipPackage)
    {
        $this->authorize('delete', $membershipPackage);

        try {
            $packageName = $membershipPackage->name;

            $this->service->deletePackage($membershipPackage);

            return back()->with('success', "Paket membership '{$packageName}' berhasil dihapus.");
        } catch (\Exception $e) {
            \Log::error("Error deleting Membership Package ID {$membershipPackage->id}: " . $e->getMessage());

            return back()->with('error', 'Gagal menghapus paket membership. Pastikan tidak ada data terkait yang masih aktif.');
        }
    }
}
