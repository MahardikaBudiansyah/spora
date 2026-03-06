<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MerchantNotificationController extends Controller
{
    private function getMerchant()
    {
        $merchant = Auth::guard('merchant')->user();

        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        return $merchant;
    }

    public function index(Request $request)
    {
        $merchant = $this->getMerchant();

        $notifications = $merchant->notifications()
            ->where('is_archived', 0)
            ->orderBy('is_pinned', 'desc')
            ->latest()
            ->paginate(15);

        return Inertia::render('Merchant/Notifications/Index', [
            'merchant' => ['name' => $merchant->name],
            'notification_list' => NotificationResource::collection($notifications),
        ]);
    }

    public function archive(Request $request)
    {
        $merchant = $this->getMerchant();

        $notifications = $merchant->notifications()
            ->where('is_archived', 1)
            ->latest()
            ->paginate(15);

        return Inertia::render('Merchant/Notifications/Archive', [
            'merchant' => ['name' => $merchant->name],
            'notification_list' => NotificationResource::collection($notifications),
        ]);
    }
}
