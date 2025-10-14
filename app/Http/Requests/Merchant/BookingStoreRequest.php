<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Bisa tambahkan policy/permission check di sini kalau perlu
        return true;
    }

    public function rules(): array
    {
        return [
            'customer.name' => 'required|string|max:255',
            'customer.phone_number' => 'required|string|max:20',
            'customer.user_id' => 'nullable|exists:users,id',

            'operator_assignment_id' => 'nullable|exists:operator_assignments,id',

            'details' => 'required|array|min:1',
            'details.*.field_id' => 'required|exists:fields,id',
            'details.*.time_slot_id' => 'required|exists:time_slots,id',
            'details.*.price' => 'required|numeric|min:0',
            'details.*.booking_date' => 'required|date',

            'payment.type' => 'nullable|in:down_payment,full_payment',
            'payment.method' => 'nullable|in:cash,transfer,gateway',
            'payment.amount' => 'nullable|numeric|min:0',
            'payment.bank' => 'nullable|string|max:100',
            'payment.digital_wallet' => 'nullable|string|max:100',
            'payment.reference_number' => 'nullable|string|max:100',
            'payment.sender_name' => 'nullable|string|max:100',
            'payment.payment_date' => 'nullable|date',
            'payment.payment_time' => 'nullable',
            'payment.payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'customer.name.required' => 'Nama penyewa wajib diisi.',
            'customer.phone_number.required' => 'Nomor telepon penyewa wajib diisi.',
            'details.required' => 'Minimal satu detail booking harus ada.',
            'details.*.field_id.required' => 'Field wajib dipilih.',
            'details.*.time_slot_id.required' => 'Slot waktu wajib dipilih.',
            'payment.amount.numeric' => 'Jumlah pembayaran harus berupa angka.',
        ];
    }
}
