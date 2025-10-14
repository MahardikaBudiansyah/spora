<?php
namespace App\Http\Controllers\User;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\MembershipPackage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\User\Controller;
use App\Services\Membership\MembershipService;
use App\Http\Requests\User\MembershipStoreRequest;

class MembershipController extends Controller
{
    private function getUser()
    {
        return Auth::user();
    }
    
    public function create(Request $request)
    {
        $user = $this->getUser();

        // Ambil paket dari session
        $package = session('selectedMembershipPackage');

        // Jika session kosong (misal user akses langsung tanpa pilih paket)
        if (!$package) {
            return redirect()
                ->route('user.dashboard')
                ->with('error', 'Silakan pilih paket membership terlebih dahulu.');
        }

        // (opsional) pastikan datanya segar dari DB, bukan hasil cache
        $package = MembershipPackage::with([
            'venue.addresses.village',
            'venue.addresses.district',
            'venue.addresses.city',
            'venue.addresses.province',
            'discounts',
            'others',
        ])->find($package['id']);

        return inertia('User/Membership/Create', [
            'user' => $user,
            'package' => $package,
        ]);
    }



    // store = user membeli membership
    public function store(MembershipStoreRequest $request)
    {
        $validated = $request->validated();  

        $user = $request->user();
        $data = [
            'membership_package_id' => $request->membership_package_id,
            'venue_id'              => $request->venue_id,
            'merchant_id'           => $request->merchant_id,
            'start_date'            => $request->start_date,
            'notes'                 => $request->notes,
        ];

        $customerData = [
            'name' => $user->name,
            'phone_number' => $user->phone,
        ];

        // Panggil MembershipService untuk create membership + invoice + payment
        $membershipService = app(MembershipService::class);
        $result = $membershipService->purchaseMembership($user->id, $data, $customerData, $user);

        return response()->json([
            'success' => true,
            'membership' => $result['membership'],
            'invoice' => $result['invoice'],
            'payment' => $result['payment'],
            'snap_token' => $result['snapToken'],
        ]);
    }

    public function selectPackages(Request $request) 
    {
        $packageId = $request->input('package_id');

        $package = MembershipPackage::findOrFail($packageId);

        // simpan paket ke session
        session(['selectedMembershipPackage' => $package]);

        // redirect ke halaman create
        return redirect()->route('user.memberships.create');
    }
}
