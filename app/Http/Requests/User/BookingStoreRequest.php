<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // bisa tambahkan policy cek user login jika perlu
    }

    public function rules(): array
    {
        return [
            // Customer info (untuk admin/guest), kalau user login biasanya di controller overwrite
            'customer.name'         => 'sometimes|required|string|max:255',
            'customer.phone_number' => 'sometimes|required|string|max:20',

            // Booking details
            'details' => ['required', 'array', 'min:1'],
            'details.*.field_id'      => ['required', 'integer', 'exists:fields,id'],
            'details.*.time_slot_id'  => ['required', 'integer', 'exists:time_slots,id'],
            'details.*.booking_date'  => ['required', 'date', 'after_or_equal:today'],
            'details.*.original_price'  => ['nullable', 'numeric'],
            'details.*.discount_amount' => ['nullable', 'numeric'],
            'details.*.final_price'    => ['nullable', 'numeric'],
            'details.*.cart_id' => ['nullable', 'integer'],

            // Payment
            'payment.method' => 'nullable|in:cash,transfer,gateway',
            'payment.type'   => ['required', 'string', 'in:full_payment,down_payment'],
            'payment.amount' => ['required_if:payment.type,full_payment,down_payment', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer.name.required'          => 'Nama penyewa wajib diisi.',
            'customer.phone_number.required'  => 'Nomor telepon penyewa wajib diisi.',
            'details.required'                => 'Minimal satu detail booking harus ada.',
            'details.*.field_id.required'     => 'Field wajib dipilih.',
            'details.*.time_slot_id.required' => 'Slot waktu wajib dipilih.',
            'details.*.booking_date.required' => 'Tanggal booking wajib diisi.',
            'details.*.booking_date.after_or_equal' => 'Tanggal booking tidak boleh di masa lalu.',
            'payment.amount.required_if'      => 'Jumlah pembayaran wajib diisi untuk full payment atau down payment.',
            'payment.amount.numeric'          => 'Jumlah pembayaran harus berupa angka.',
        ];
    }
}
