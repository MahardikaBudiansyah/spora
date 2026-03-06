<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\PlatformPayoutMethod;
use Illuminate\Support\Facades\Auth;

class PlatformPayoutMethodController extends Controller
{
    public function store(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        $platform = $admin->platformProfile;

        if (!$platform) {
            return back()->withErrors(['message' => 'Lengkapi profil bisnis terlebih dahulu.']);
        }
        
        $request->validate([
            'type' => 'required|in:bank,ewallet',
            'provider_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'account_holder_name' => 'required|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request, $platform) {
                $isFirst = !$platform->payoutMethods()->exists();

                $platform->payoutMethods()->create([
                    'type' => $request->type,
                    'provider_name' => $request->provider_name,
                    'account_number' => $request->account_number,
                    'account_holder_name' => $request->account_holder_name,
                    'is_primary' => $isFirst,
                ]);
            });

            return back()->with('success', 'Data Rekening berhasil ditambahkan.');

        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $platform = Auth::guard('admin')->user()->platformProfile;

        $request->validate([
            'type' => 'required|in:bank,ewallet',
            'provider_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'account_holder_name' => 'required|string|max:255',
        ]);

        try {
            $payout = PlatformPayoutMethod::where('platform_profile_id', $platform->id)
                ->findOrFail($id);

            $payout->update($request->only([
                'type', 
                'provider_name', 
                'account_number', 
                'account_holder_name'
                ])
            );

            return back()->with('success', 'Data rekening berhasil diperbarui.');

        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $platform = Auth::guard('admin')->user()->platformProfile;
    
        return DB::transaction(function () use ($platform, $id) {
            $payout = PlatformPayoutMethod::where('platform_profile_id', $platform->id)
                ->findOrFail($id);

            if ($payout->is_primary) {
                $nextPrimary = PlatformPayoutMethod::where('platform_profile_id', $platform->id)
                    ->where('id', '!=', $id)
                    ->orderBy('created_at', 'asc')
                    ->first();
                
                if ($nextPrimary) {
                    $nextPrimary->update(['is_primary' => true]);
                }
            }

            $payout->delete();

            return back()->with('success', 'Data Rekening berhasil dihapus.');
        });
    }

    public function setPrimary($id)
    {
        $platform = Auth::guard('admin')->user()->platformProfile;
        
        $payout = PlatformPayoutMethod::where('platform_profile_id', $platform->id)
            ->findOrFail($id);

        DB::transaction(function () use ($platform, $payout) {
            PlatformPayoutMethod::where('platform_profile_id', $platform->id)
                ->update(['is_primary' => false]);

            $payout->update(['is_primary' => true]);
        });

        return back()->with('success', 'Rekening utama berhasil diperbarui.');
    }
}