<?php

namespace App\Http\Controllers\User;

use Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\NumberPhoneHelper;
use App\Helpers\UploadImageHelper;
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
        $validated = $request->safe()->except(['photo']);

        if (!empty($validated['phone_number'])) {
            $validated['phone_number'] = NumberPhoneHelper::normalize($validated['phone_number']);
            
            if (!$user->phone_verified_at) {
                $user->phone_verified_at = now();
            }
        }

        if (!empty($validated['email'])) {
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
            }
        }

        if ($request->hasFile('photo')) {
            $path = UploadImageHelper::handleUserProfile($request->file('photo'), $user->id);
            $user->photo = $path;
        }

        $user->fill($validated);
        
        $user->save(); 

        return Redirect::route('user.profile.edit')
            ->with('status', 'Profil berhasil diperbarui.');
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
