<?php

namespace App\Traits;

use App\Models\StatusHistory;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasStatusHistory
{
    public function statusHistories(): MorphMany
    {
        return $this->morphMany(StatusHistory::class, 'statusable');
    }

    public function latestStatusHistory(): MorphOne
    {
        return $this->morphOne(StatusHistory::class, 'statusable')->latestOfMany();
    }


    public function recordStatusHistory(?string $reason = null): void
    {
        $statusValue = is_object($this->status) && isset($this->status->value)
            ? $this->status->value
            : $this->status;

        $modelName = class_basename($this);
        $snakeName = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $modelName));

        $specificKey = "reason_{$snakeName}";
        $inputReason = request()->input($specificKey) ?? request()->input('reason');
        $finalReason = $reason ?: $inputReason;

        $isSystem = empty(trim($finalReason));

        if ($isSystem) {
            if (app()->runningInConsole() && $this->wasRecentlyCreated) {
                $finalReason = "Data awal sistem (Seeder).";
            } else {
                $finalReason = match ($statusValue) {
                    'draft'    => "Data disimpan sebagai draft.",
                    'pending'  => "Mengajukan verifikasi data {$modelName}.",
                    'approved' => "Data {$modelName} telah disetujui oleh Admin.",
                    'rejected' => "Data {$modelName} ditolak karena tidak memenuhi syarat.",
                    default    => $this->wasRecentlyCreated
                        ? "Pendaftaran awal data {$modelName}"
                        : "Status {$modelName} diperbarui oleh sistem."
                };
            }
        }

        $adminUser = auth('admin')->user();
        $merchantUser = auth('merchant')->user();

        $snapshotName = 'System';
        if ($adminUser) {
            $snapshotName = $adminUser->name . ' (Admin)';
        } elseif ($merchantUser) {
            $snapshotName = $merchantUser->name . ' (Merchant)';
        }

        $this->statusHistories()->create([
            'status' => $statusValue,
            'reason' => $finalReason,
            'is_system_generated' => $isSystem,
            'admin_id' => auth('admin')->id(),
            'merchant_id' => auth('merchant')->id() ?? ($this->merchant_id ?? null),
            'change_by_snapshot' => $snapshotName,
        ]);
    }
}
