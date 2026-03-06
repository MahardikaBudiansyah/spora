<?php

namespace App\Services\Membership;

use App\Models\User;
use App\Models\Venue;
use App\Models\MembershipCard;
use App\Helpers\MembershipHelper;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Pagination\LengthAwarePaginator;

class MembershipCardService
{
    public function getCardsByMerchant(
        int $merchantId, 
        array $filters = [], 
        int $perPage = 15, 
        array $relations = []
    ) {
        $query = MembershipCard::whereHas('venue', fn($q) => 
            $q->where('merchant_id', $merchantId)
        );
        
        return $this->finalizeQuery($query, $filters, $perPage, $relations);
    }

    public function getCardsByVenue(
        int $venueId, 
        array $filters = [], 
        int $perPage = 15, 
        array $relations = []
    ) {
        $query = MembershipCard::where('venue_id', $venueId);
        
        return $this->finalizeQuery($query, $filters, $perPage, $relations);
    }

    public function getAllCards(array $filters)
    {
        $query = MembershipCard::query();
        
        return $this->finalizeQuery($query, $filters);
    }

    public function getCardsForUser(int $userId)
    {
        return MembershipCard::with(['venue', 'latestOrder.membershipPackage'])
            ->where('user_id', $userId)
            ->orderBy('is_active', 'desc')
            ->latest()
            ->get();
    }

    private function finalizeQuery($query, array $filters, int $perPage = 15, array $relations = [])
    {
        $defaultRelations = ['user', 'venue', 'latestOrder.membershipPackage'];
        $query->with(empty($relations) ? $defaultRelations : $relations)
            ->latest();

        $this->applyFilters($query, $filters);

        return $query->paginate($perPage)->withQueryString();
    }

    protected function applyFilters($query, array $filters)
    {
        if ($search = $filters['search'] ?? null) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('member_no', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qUser) use ($search) {
                        $qUser->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%");
                    });
            });
        }
        return $query;
    }

    public function getOrCreateCard(int $venueId, array $customerData): MembershipCard
    {
        $normalizedPhone = NumberPhoneHelper::normalize($customerData['phone_number']);
        $userId = $customerData['user_id'] ?? null;

        $card = MembershipCard::where('venue_id', $venueId)
            ->where(function ($query) use ($userId, $normalizedPhone) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('phone_number', $normalizedPhone);
                }
            })
            ->first();

        if ($card) {
            return $card;
        }

        return $this->createCardForCustomer([
            'venue_id'      => $venueId,
            'customer_id'   => $userId,
            'customer_name' => $customerData['name'],
            'customer_phone'=> $normalizedPhone,
            'customer_email'=> $customerData['email'] ?? null,
        ]);
    }

    public function getOrCreateCardForUser(
        int $userId, 
        int $venueId, 
        string $name, 
        string $phone, 
        ?string $email = null
    ): MembershipCard {
        return $this->getOrCreateCard($venueId, [
            'user_id' => $userId,
            'name' => $name,
            'phone_number' => $phone,
            'email' => $email
        ]);
    }

    public function createCardForCustomer(array $data): MembershipCard
    {
        return DB::transaction(function () use ($data) {
            $normalizedPhone = NumberPhoneHelper::normalize($data['customer_phone']);
            
            $this->ensureNoDuplicateCard(
                $data['venue_id'], 
                $data['customer_id'] ?? null, 
                $normalizedPhone
            );

            $venue = Venue::findOrFail($data['venue_id']);

            $memberNo = MembershipHelper::generateMemberNo(
                $venue->merchant_id,
                $venue->id,
                $data['customer_id'] ?? null
            );

            return MembershipCard::create([
                'venue_id'     => $venue->id,
                'user_id'      => $data['customer_id'] ?? null,
                'member_no'    => $memberNo,
                'name'         => $data['customer_name'],
                'phone_number' => $normalizedPhone,
                'email'        => $data['customer_email'] ?? null,
                'notes'        => $data['notes'] ?? null,
                'is_active'    => true,
            ]);
        });
    }

    public function ensureNoDuplicateCard(int $venueId, ?int $userId = null, ?string $phoneNumber = null): void
    {
        $query = MembershipCard::where('venue_id', $venueId)->where('is_active', true);

        $query->where(function ($q) use ($userId, $phoneNumber) {
            if ($userId) {
                $q->where('user_id', $userId);
            }
            if ($phoneNumber) {
                $q->orWhere('phone_number', $phoneNumber);
            }
        });

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'customer_phone' => 'Customer sudah memiliki kartu member aktif di venue ini.',
            ]);
        }
    }

    public function linkCardToUser(string $phoneNumber, int $userId)
    {
        MembershipCard::where('phone_number', $phoneNumber)
            ->whereNull('user_id')
            ->update(['user_id' => $userId]);
    }
    
    public function updateCard(MembershipCard $card, array $data): MembershipCard
    {
        $card->update([
            'notes' => $data['notes'] ?? $card->notes,
            'name'  => !$card->user_id ? ($data['customer_name'] ?? $card->name) : $card->name,
        ]);

        return $card;
    }

    public function toggleCardStatus(MembershipCard $card, ?bool $status = null): MembershipCard
    {
        $card->is_active = is_null($status) ? !$card->is_active : $status;
        $card->save();

        return $card;
    }

    public function deleteCard(MembershipCard $card): bool
    {
        $hasActiveOrders = $card->orders()
            ->whereIn('status', ['pending', 'active', 'queued'])
            ->exists();
        
        if ($hasActiveOrders) {
            throw ValidationException::withMessages([
                'card' => 'Tidak bisa menghapus kartu member karena masih ada transaksi yang belum selesai.'
            ]);
        }

        return $card->delete();
    }
}