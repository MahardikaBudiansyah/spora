<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreCartRequest;

class CartController extends Controller
{
    private function getUser()
    {
        return Auth::user();
    }

    public function index()
    {
        $user = $this->getUser();

        $cartItems = Cart::with(['venue', 'field', 'timeSlot'])
            ->where('user_id', $user->id)
            ->get();

        // Grouping data
        $grouped = $cartItems->groupBy('venue_id')->map(function ($venueGroup) {
            return [
                'venue' => $venueGroup->first()->venue,
                'fields' => $venueGroup->groupBy('field_id')->map(function ($fieldGroup) {
                    return [
                        'field' => $fieldGroup->first()->field,
                        'dates' => $fieldGroup->groupBy('date')->map(function ($dateGroup) {
                            return [
                                'date' => $dateGroup->first()->date,
                                'timeslots' => $dateGroup->map(function ($item) {
                                    return [
                                        'id' => $item->id,
                                        'timeSlot' => $item->timeSlot,
                                        'total_price' => $item->total_price,
                                    ];
                                })->values(),
                            ];
                        })->values(),
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'data' => $grouped,
        ]);
    }


    // Tambah item ke cart
    public function store(StoreCartRequest $request)
    {
        $user = $this->getUser();

        $validated = $request->validated();

        // cek duplikat cart
        $existing = Cart::where('user_id', $user->id)
            ->where('field_id', $validated['field_id'])
            ->where('time_slot_id', $validated['time_slot_id'])
            ->where('date', $validated['date'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Slot sudah ada di cart'], 400);
        }

        // buat cart
        $cart = Cart::create([
            'user_id' => $user->id,
            'venue_id' => $validated['venue_id'],
            'field_id' => $validated['field_id'],
            'time_slot_id' => $validated['time_slot_id'],
            'date' => $validated['date'],
            'total_price' => $validated['total_price'],
        ]);

        // buat history langsung (bisa tambah validasi manual juga)
        CartHistory::create([
            'cart_id' => $cart->id,
            'user_id' => $user->id,
            'field_id' => $validated['field_id'],
            'time_slot_id' => $validated['time_slot_id'],
            'price' => $validated['total_price'],
            'status' => 'added',
            'added_at' => now(),
        ]);

        return response()->json([
            'message' => 'Item berhasil ditambahkan ke cart',
            'data' => $cart,
        ]);
    }

    // Hapus item dari cart
    public function destroy(Cart $cart)
    {
        $user = $this->getUser();

        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Simpan history status 'removed'
        CartHistory::create([
            'cart_id' => $cart->id,
            'user_id' => $user->id,
            'field_id' => $cart->field_id,
            'time_slot_id' => $cart->time_slot_id,
            'price' => $cart->total_price,
            'status' => 'removed',
            'added_at' => now(),
        ]);

        $cart->delete();

        return response()->json(['message' => 'Item dihapus dari cart']);
    }


    // Checkout sederhana: hapus semua item cart user dan simpan status booked di history
    public function checkout(Request $request)
    {
        $user = $this->getUser();

        $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
        ]);

        $venueId = $request->venue_id;

        // Ambil cart hanya untuk user dan venue tertentu
        $cartItems = Cart::where('user_id', $user->id)
            ->where('venue_id', $venueId)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart kosong untuk venue ini'], 400);
        }

        foreach ($cartItems as $cart) {
            CartHistory::create([
                'cart_id' => $cart->id,
                'user_id' => $user->id,
                'field_id' => $cart->field_id,
                'time_slot_id' => $cart->time_slot_id,
                'price' => $cart->total_price,
                'status' => 'booked',
                'added_at' => now(),
            ]);
        }

        // Hapus cart untuk venue ini setelah checkout
        Cart::where('user_id', $user->id)
            ->where('venue_id', $venueId)
            ->delete();

        return response()->json(['message' => 'Checkout berhasil, cart dikosongkan']);
    }

}
