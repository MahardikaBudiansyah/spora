<?php

namespace App\Http\Controllers\Merchant;

use Log;
use Exception;
use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Resources\MembershipPackageResource;
use App\Services\Membership\MembershipPackageService;
use App\Http\Requests\Merchant\MembershipPackageRequest;

class VenueMembershipPackageController extends Controller
{    
    protected $service;

    public function __construct(MembershipPackageService $service) 
    {
        $this->service = $service;
    }
    
    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);
        $this->authorize('viewAny', MembershipPackage::class);

        $packages = $this->service->getPackagesByVenue($venue->id);

        return inertia('Merchant/Venue/Membership/MembershipPackages/Index', [
            'venue' => $venue,
            'packages' => MembershipPackageResource::collection($packages),
        ]);
    }

    public function store(MembershipPackageRequest $request, Venue $venue)
    {
        $this->authorize('view', $venue);    
        $this->authorize('create', [MembershipPackage::class, $venue]);
        
        try {
            $data = $request->validated();
            $data['venue_id'] = $venue->id; 

            $this->service->createPackage($data);

            return back()->with('success', 'Paket membership berhasil ditambahkan!');
        } catch (Exception $e) {
            Log::error("Gagal membuat paket: " . $e->getMessage());
            return back()->with('error', 'Gagal membuat paket. Silakan coba lagi.');
        }
    }

    public function update(MembershipPackageRequest $request, Venue $venue, MembershipPackage $package)
    {
        $this->authorize('update', $package); 

        try {
            $this->service->updatePackage($package, $request->validated());
            
            return back()->with('success', 'Paket membership berhasil diperbarui!');
        } catch (Exception $e) {
            Log::error("Gagal update paket: " . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui paket.');
        }
    }

    public function toggleActive(Request $request, Venue $venue, MembershipPackage $package)
    {
        $this->authorize('toggleActive', $package); 

        try {
            $this->service->togglePackageStatus($package);

            return response()->json([
                'success' => true,
                'message' => "Status paket '{$package->name}' berhasil diubah.",
                'is_active' => $package->is_active,
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => "Gagal mengubah status."], 500);
        }
    }

    public function destroy(Venue $venue, MembershipPackage $package)
    {
        $this->authorize('delete', $package);

        try {
            $this->service->deletePackage($package); // Pakai Service
            
            return response()->json([
                'success' => true,
                'message' => "Paket berhasil dihapus.",
            ]);
        } catch (\Exception $e) {
            \Log::error("Destroy Venue Package Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => "Gagal menghapus paket.",
            ], 500);
        }
    }

}
