<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
use App\Models\Cart;
use App\Models\CartHistory;
use Illuminate\Http\Request;
use App\Http\Resources\CartResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CartStoreRequest;

class CartController extends Controller
{
    public function index()
    {
        try {
            $this->authorize('viewAny', Cart::class);
            
            $user = Auth::user();

            $carts = Cart::with(['venue', 'court', 'timeSlot'])
                ->where('user_id', $user->id)
                ->where('date', '>=', now()->toDateString()) 
                ->get();

            return new CartResource($carts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data keranjang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(CartStoreRequest $request)
    {
        try {
            $this->authorize('create', Cart::class);

            $validated = $request->validated();
            $user = Auth::user();

            $selectedDate = Carbon::parse($validated['date']);
            if ($selectedDate->isPast() && !$selectedDate->isToday()) {
                return response()->json([
                    'message' => 'Tidak dapat memilih jadwal di masa lalu.'
                ], 422);
            }

            $dayType = $selectedDate->isWeekend() ? 'weekend' : 'weekday';

            $cart = Cart::create([
                'user_id'      => $user->id,
                'venue_id'     => $validated['venue_id'],
                'court_id'     => $validated['court_id'],
                'time_slot_id' => $validated['time_slot_id'],
                'date'         => $validated['date'],
                'price'        => $validated['price'], 
                'day_type'     => $dayType, 
            ]);

            return response()->json([
                'message' => 'Item berhasil ditambahkan ke cart',
                'data' => $cart,
            ]);

        } catch (\Exception $e) {
            if ($e->getCode() == 23000) {
                return response()->json(['message' => 'Slot ini sudah ada di keranjang Anda'], 400);
            }

            return response()->json([
                'message' => 'Gagal menambahkan ke keranjang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Cart $cart)
    {
        try {
            $this->authorize('delete', $cart);

            $cart->delete();
            return response()->json(['message' => 'Item dihapus dari cart']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus item atau akses ditolak'], 403);
        }
    }
}
