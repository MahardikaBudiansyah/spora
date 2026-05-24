<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Admin\Controller;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Log;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $admins = Admin::query()
            ->with([
                'latestStatusHistory',
                'profile.address.province',
                'profile.address.city',
                'profile.address.district',
                'profile.address.village',
            ])
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Admins/Index', [
            'admins' => AdminResource::collection($admins),
        ]);
    }

    public function toggleActive(Admin $admin, Request $request)
    {
        $this->authorize('update', $admin);

        $request->validate([
            'is_active' => ['required', 'boolean']
        ]);

        $admin->is_active = $request->is_active;
        $admin->save();

        return back()->with('success', 'Status data Admin diperbarui.');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Admin::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'unique:admins,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $normalizedPhone = $validated['phone_number']
            ? NumberPhoneHelper::normalize($validated['phone_number'])
            : null;

        $admin = Admin::create([
            'name' => $validated['name'],
            'phone_number' => $normalizedPhone,
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'admin',
            'is_active' => 1,
        ]);

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin baru berhasil ditambahkan.');
    }

    public function update(Request $request, Admin $admin)
    {
        $this->authorize('update', $admin);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $admin->name = $validated['name'];

        if (!empty($validated['phone_number'])) {
            $admin->phone_number = NumberPhoneHelper::normalize($validated['phone_number']);
        }

        if (!empty($validated['password'])) {
            $admin->password = $validated['password'];
        }

        $admin->save();

        return redirect()->route('admin.admins.index')
            ->with('success', 'Data Admin berhasil diperbarui.');
    }

    public function destroy(Admin $admin)
    {
        $this->authorize('delete', $admin);

        $admin->delete();

        return back()->with('success', 'Data Admin berhasil dihapus');
    }
}
