<?php
namespace App\Services\Membership;

use App\Models\Venue;
use Illuminate\Support\Arr;
use App\Models\MembershipPackage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MembershipPackageService
{
    public function getPackagesByMerchant(int $merchantId)
    {
        return Venue::with([
                'merchant', 
                'membershipPackages.discounts', 
                'membershipPackages.others'
            ])
            ->where('merchant_id', $merchantId)
            ->get();
    }

    public function getPackagesByVenue(int $venueId, array $filters = [])
    {
        $query = MembershipPackage::with(['discounts', 'others'])
            ->where('venue_id', $venueId)
            ->oldest();

        return $query->get();
    }

    public function getAllPackages(array $filters = [])
    {
        return MembershipPackage::with(['venue.merchant', 'discounts', 'others'])
            ->latest()
            ->paginate(15);
    }

    public function getAvailablePackagesForUser(int $venueId)
    {
        return MembershipPackage::with(['discounts', 'others'])
            ->where('venue_id', $venueId)
            ->orderBy('price', 'asc')
            ->get();
    }

    public function createPackage(array $data): MembershipPackage
    {
        $venue = Venue::findOrFail($data['venue_id']);

        return DB::transaction(function () use ($data) {
            $package = MembershipPackage::create([
                'venue_id' => $data['venue_id'],
                'name' => $data['package_name'],
                'duration_months' => $data['package_duration_months'],
                'price' => $data['package_price'],
                'description' => $data['package_descriptions'] ?? null,
            ]);

            $this->syncRelations($package, $data);
            return $package;
        });
    }

    public function updatePackage(MembershipPackage $package, array $data): MembershipPackage
    {
        return DB::transaction(function () use ($package, $data) {
            $package->update([
                'name' => $data['package_name'],
                'duration_months' => $data['package_duration_months'],
                'price' => $data['package_price'],
                'description' => $data['package_descriptions'] ?? null,
            ]);

            $package->discounts()->delete();
            $package->others()->delete();

            $this->syncRelations($package, $data);
            return $package;
        });
    }

    public function togglePackageStatus(MembershipPackage $package, ?bool $status = null): MembershipPackage
    {
        $package->is_active = is_null($status) ? !$package->is_active : $status;
        $package->save();

        return $package;
    }

    public function deletePackage(MembershipPackage $package): bool
    {
        $activeConnections = $package->orders()
            ->whereIn('status', ['pending', 'active', 'queued'])
            ->exists();
        
        if ($activeConnections) {
            throw ValidationException::withMessages([
                'package' => 'Tidak bisa menghapus paket karena masih ada transaksi yang pending, active, atau dalam antrean (queued).'
            ]);
        }

        return $package->delete();
    }

    protected function syncRelations(MembershipPackage $package, array $data): void
    {
        if (!empty($data['discount_name'])) {
            $package->discounts()->create([
                'name' => $data['discount_name'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount_limit' => $data['discount_limit'],
                'description' => $data['discount_descriptions'] ?? null,
            ]);
        }

        if (!empty($data['other_name'])) {
            $package->others()->create([
                'name' => $data['other_name'],
                'description' => $data['other_descriptions'] ?? null,
            ]);
        }
    }
}