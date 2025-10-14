<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\User\ProfileUpdateRequest;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('User/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
            'user' => $request->user()->fresh() 
        ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        // Normalisasi di backend untuk jaga-jaga
        if (!empty($validated['phone_number'])) {
            $validated['phone_number'] = NumberPhoneHelper::normalize($validated['phone_number']);
        }

        $user->fill($validated);
        $user->save();

        return Redirect::route('user.profile.edit')->with('status', 'Profil berhasil diperbarui.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
