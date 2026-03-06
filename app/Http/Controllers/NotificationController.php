<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        if (isset($notification->data['action_url'])) {
            return redirect($notification->data['action_url']);
        }

        return back();
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'Semua notifikasi ditandai sebagai dibaca.');
    }

    public function bulkAction(Request $request)
    {
        // Log info awal untuk memantau request masuk
        Log::info('🔔 Notification Bulk Action Started', [
            'user_id' => $request->user()->id,
            'action'  => $request->action,
            'ids'     => $request->ids,
            'ip'      => $request->ip()
        ]);

        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|in:read,unread,pin,unpin,archive,unarchive,delete',
        ]);

        try {
            $query = $request->user()->notifications()->whereIn('id', $request->ids);
            $count = $query->count(); // Ambil jumlah data yang akan diupdate

            match ($request->action) {
                'read'      => $query->update(['read_at' => now()]),
                'unread'    => $query->update(['read_at' => null]),
                'archive'   => $query->update(['is_archived' => 1]), // Gunakan 1/0 jika true/false masih gagal
                'unarchive' => $query->update(['is_archived' => 0]),
                'pin'       => $query->update(['is_pinned' => 1]),
                'unpin'     => $query->update(['is_pinned' => 0]),
                'delete'    => $query->delete(),
            };

            Log::info('✅ Notification Bulk Action Success', [
                'action' => $request->action,
                'affected_rows' => $count
            ]);

            return back()->with('success', 'Perubahan berhasil diterapkan.');
        } catch (\Exception $e) {
            // Log jika terjadi error (sangat berguna untuk debugging database)
            Log::error('❌ Notification Bulk Action Failed', [
                'message' => $e->getMessage(),
                'action' => $request->action,
                'ids' => $request->ids
            ]);

            return back()->with('error', 'Gagal memproses permintaan.');
        }
    }
}
