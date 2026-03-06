<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('merchant')->check();
    }

    public function rules(): array
    {
        return [
            'venue_id'               => ['required', 'integer', 'exists:venues,id'],
            'operator_assignment_id' => ['nullable', 'integer', 'exists:operator_assignments,id'],
            
            // Data Customer (Wajib untuk snapshot booking)
            'customer_id'            => ['nullable', 'integer', 'exists:users,id'],
            'customer_name'          => ['required', 'string', 'max:255'],
            'customer_phone'         => ['required', 'string', 'max:20'],
            
            // Membership (Opsional, jika menggunakan diskon member)
            'membership_card_id'     => ['nullable', 'integer', 'exists:membership_cards,id'],

            // Detail Item Booking
            'details'                 => ['required', 'array', 'min:1'],
            'details.*.court_id'      => ['required', 'exists:courts,id'],
            'details.*.time_slot_id'  => ['required', 'exists:time_slots,id'],
            'details.*.booking_date'  => ['required', 'date', 'after_or_equal:today'],
            'details.*.original_price'=> ['required', 'numeric', 'min:0'],
            'details.*.discount_amount'=> ['required', 'numeric', 'min:0'],
            'details.*.final_price'   => ['required', 'numeric', 'min:0'],
            
            // Tambahan Snapshot (Opsional tapi disarankan agar service tidak query ulang)
            'details.*.court_name'    => ['nullable', 'string'],
            'details.*.time_range'    => ['nullable', 'string'],

            // Payment & Pricing
            'payment_type'           => ['required', 'string', 'in:down_payment,full_payment'],
            'payment_method'         => ['required', 'string', 'in:cash,bank_transfer,ewallet,qris'],
            'amount'                 => ['required', 'numeric', 'min:0'],
            'total_original_price'   => ['required', 'numeric', 'min:0'], 
            'total_price'            => ['required', 'numeric', 'min:0'],
            'total_discount'         => ['nullable', 'numeric', 'min:0'],

            // Data Payment Detail (Offline)
            'bank'                   => ['nullable', 'string'],
            'digital_wallet'         => ['nullable', 'string'],
            'reference_no'           => ['nullable', 'string'],
            'payer_name'             => ['nullable', 'string'],
            'payment_date'           => ['nullable', 'date'],
            'proof_of_payment'       => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'details.required'        => 'Minimal pilih satu jadwal lapangan.',
            'customer_name.required'  => 'Nama pelanggan wajib diisi.',
            'customer_phone.required' => 'Nomor telepon wajib diisi.',
            'amount.min'              => 'Jumlah pembayaran tidak boleh kurang dari 0.',
            'proof_of_payment.max'    => 'Ukuran bukti pembayaran maksimal 5MB.',
        ];
    }

    protected function prepareForValidation()
    {
        $venueId = $this->route('venue') 
            ? (is_object($this->route('venue')) ? $this->route('venue')->id : $this->route('venue'))
            : $this->venue_id;

        $mergeData = [
            'venue_id' => $venueId,
        ];

        if ($this->has('amount')) {
            $mergeData['amount'] = (float) str_replace(',', '', $this->amount);
        }

        if ($this->has('total_price')) {
            $mergeData['total_price'] = (float) str_replace(',', '', $this->total_price);
        }

        $this->merge($mergeData);
    }
}