<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Enums\StaffStatus;
use App\Helpers\NumberPhoneHelper;
use App\Models\MerchantStaffRole;
use App\Models\Shift;
use App\Models\Staff;
use App\Models\StaffRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $merchantId = auth('merchant')->id();

        $staff = Staff::with(['profiles', 'merchantStaffRole.staffRole'])
            ->where('merchant_id', $merchantId)
            ->oldest()
            ->paginate(10);

        $currentPage = $staff->currentPage();
        $perPage = $staff->perPage();

        $staff->getCollection()->transform(function ($staffItem, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $staffItem->id,
                'name' => $staffItem->name,
                'username' => $staffItem->username,
                'roles' => [
                    'id' => $staffItem->merchantStaffRole->staff_role_id ?? null,
                    'name' => $staffItem->merchantStaffRole->staffRole->name ?? null,
                ],
                'phone_number' => $staffItem->phone_number,
                'email' => $staffItem->email,
                'status' => $staffItem->status,
                'created_at' => $staffItem->created_at->format('d M Y'),
                'updated_at' => $staffItem->updated_at->format('d M Y'),
            ];
        });

        $globalRoles = StaffRole::select('id', 'name')->get();

        $merchantRoles = MerchantStaffRole::with('staffRole:id,name')
            ->where('merchant_id', $merchantId)
            ->get()
            ->map(fn($msr) => [
                'id' => $msr->id,
                'staff_role_id' => $msr->staff_role_id,
                'name' => $msr->staffRole->name,
            ]);

        // Shifts untuk modal
        $shifts = Shift::where('merchant_id', $merchantId)
            ->orderBy('start_time')
            ->get()
            ->map(fn($shift) => [
                'id' => $shift->id,
                'name' => $shift->name,
                'start_time' => date('H:i', strtotime($shift->start_time)),
                'end_time' => date('H:i', strtotime($shift->end_time)),
            ]);

        return Inertia::render('Merchant/Staff/Index', [
            'merchant' => [
                'name' => auth('merchant')->user()->name,
            ],
            'staff' => $staff,
            'globalRoles' => $globalRoles,
            'merchantRoles' => $merchantRoles,
            'shifts' => $shifts,
            'can_create' => auth('merchant')->user()->status === MerchantStatus::APPROVED,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => ['required', 'regex:/^08[0-9]{8,11}$/', 'max:20'],
            'email' => 'nullable|email|unique:staff,email',
            'password' => 'required|string|min:8',
            'role_id' => ['required', 'exists:merchant_staff_roles,id,merchant_id,' . auth('merchant')->id()],
        ]);

        Staff::create([
            'name'                   => $validated['name'],
            'phone_number' => NumberPhoneHelper::normalize($validated['phone_number']),
            'email'                  => $validated['email'],
            'password'               => Hash::make($validated['password']),
            'status'                 => StaffStatus::ACTIVE,
            'merchant_id'            => auth('merchant')->id(),
            'merchant_staff_role_id' => $validated['role_id'],
        ]);

        return redirect()->route('merchant.staff.index')->with('success', 'Staff berhasil ditambahkan');
    }

    public function updateStatus(Staff $staff, Request $request)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $staff->status = $request->status;
        $staff->save();

        return response()->json([
            'success' => true,
            'status' => $staff->status,
        ]);
    }

    public function syncMerchantRoles(Request $request)
    {
        $request->validate([
            'roles' => 'nullable|array', // bisa kosong, artinya merchant hapus semua role
            'roles.*' => 'exists:staff_roles,id',
        ]);

        $merchantId = auth('merchant')->id();

        // Sync = hapus dulu role lama, lalu isi dengan roles baru
        MerchantStaffRole::where('merchant_id', $merchantId)->delete();

        if ($request->filled('roles')) {
            foreach ($request->roles as $roleId) {
                MerchantStaffRole::create([
                    'merchant_id' => $merchantId,
                    'staff_role_id' => $roleId,
                ]);
            }
        }

        return back()->with('success', 'Roles updated successfully.');
    }
}
