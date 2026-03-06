<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Models\Merchant;
use Illuminate\Http\Request;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class MerchantController extends Controller
{
    public function updateLogo(Request $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate(['logo_path' => ['nullable']]);

        try {
            $path = UploadImageHelper::resolveProfilePath($request, $merchant, 'logo_path', 'merchants');

            $merchant->update(['logo_path' => $path]);

            return back()->with('success', 'Logo Mitra berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['logo_path' => 'Gagal memperbarui logo: ' . $e->getMessage()]);
        }
    }

    public function updateAccount(Request $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo_path' => ['nullable'],
        ]);

        try {
            DB::beginTransaction();

            $path = UploadImageHelper::resolveProfilePath($request, $merchant, 'logo_path', 'merchants');

            $merchant->update([
                'name' => $validated['name'],
                'logo_path' => $path,
            ]);

            DB::commit();
            return back()->with('success', 'Data Mitra berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function updateAccountSecurity(Request $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate([
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.current_password' => 'Password saat ini tidak cocok.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        try {
            $merchant->update([
                'password' => Hash::make($request->password),
            ]);

            return back()->with('success', 'Password berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Gagal memperbarui password: ' . $e->getMessage()
            ]);
        }
    }

    public function requestDeactivation(Request $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate([
            'reason' => 'required|string|min:10|max:500',
        ]);

        if ($merchant->status === MerchantStatus::DEACTIVATION_REQUESTED) {
            return back()->withErrors(['message' => 'Pengajuan penonaktifan Anda sedang dalam antrean peninjauan.']);
        }

        $merchant->update([
            'status' => MerchantStatus::DEACTIVATION_REQUESTED,
        ]);

        $merchant->statusHistories()->create([
            'status' => MerchantStatus::DEACTIVATION_REQUESTED,
            'reason' => $request->reason,
        ]);

        return back();
    }
}
