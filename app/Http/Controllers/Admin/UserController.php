<?php

namespace App\Http\Controllers\Admin;

use Log;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->withCount('bookingCustomers')
            ->orderBy('created_at', 'asc') // atau oldest()
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function toggleActive(User $user, Request $request)
    {
        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $user->is_active = $request->is_active;
        $user->save();

        return back()->with('success', 'Status user diperbarui.');
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete(); 

        return back()->with('success', 'User berhasil dihapus.');
    }



}