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

        $carts = Cart::with(['venue', 'field', 'timeSlot'])
            ->where('user_id', $user->id)
            ->get();

        // Grouping: venue -> date -> field
        $grouped = $carts->groupBy('venue_id')->map(function ($venueGroup) {
            $venue = $venueGroup->first()->venue;

            // Group by date first
            $dates = $venueGroup->groupBy('date')->map(function ($dateGroup, $date) {
                // Then group by field
                $fields = $dateGroup->groupBy('field_id')->map(function ($fieldGroup) {
                    return [
                        'field' => $fieldGroup->first()->field,
                        'timeslots' => $fieldGroup->map(function ($item) {
                            return [
                                'cart_id' => $item->id,
                                'timeslot_id' => $item->timeSlot->id, 
                                'name' => $item->timeSlot->name, 
                                'price' => $item->price,
                            ];
                        })->values(),
                    ];
                })->values();

                return [
                    'date' => $date,
                    'fields' => $fields,
                ];
            })->values();

            return [
                'venue' => $venue,
                'dates' => $dates,
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
            'price' => $validated['price'],
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

        $cart->delete();

        return response()->json(['message' => 'Item dihapus dari cart']);
    }

}
