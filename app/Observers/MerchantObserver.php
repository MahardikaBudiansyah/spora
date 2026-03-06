<?php

namespace App\Observers;

class MerchantObserver
{
    public function saved($model)
    {
        if ($model->wasChanged('status') || $model->wasRecentlyCreated) {
            $model->recordStatusHistory();
        }

        if (method_exists($model, 'merchant') && $model->merchant) {
            $model->merchant->syncVerificationStatus();
        }

        if ($model instanceof \App\Models\Merchant) {
            // Logika khusus merchant jika diperlukan
        }
    }
}
