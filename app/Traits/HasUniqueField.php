<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUniqueField
{
    /**
     * Generate unique value for given column based on a source.
     *
     * @param string $column  Nama kolom target, misal 'username' atau 'slug'
     * @param string $sourceValue Nilai dasar, misal dari 'name'
     * @param int|null $excludeId ID untuk diabaikan saat update
     * @return string
     */
    public static function generateUniqueField(string $column, string $sourceValue, ?int $excludeId = null): string
    {
        $baseValue = Str::slug($sourceValue, '_');
        $value = $baseValue;
        $count = 1;

        while (self::withTrashed()
            ->where($column, $value)
            ->when($excludeId, fn($query) => $query->where('id', '!=', $excludeId))
            ->exists()
        ) {
            $value = $baseValue . '_' . $count;
            $count++;
        }

        return $value;
    }

    protected static function bootHasUniqueField()
    {
        static::creating(function ($model) {
            if (property_exists($model, 'uniqueFields') && is_array($model->uniqueFields)) {
                foreach ($model->uniqueFields as $field => $source) {
                    if (empty($model->$field) && !empty($model->$source)) {
                        $model->$field = self::generateUniqueField($field, $model->$source);
                    }
                }
            }
        });

        static::updating(function ($model) {
            if (property_exists($model, 'uniqueFields') && is_array($model->uniqueFields)) {
                foreach ($model->uniqueFields as $field => $source) {
                    if (!empty($model->$source)) {
                        $model->$field = self::generateUniqueField($field, $model->$source, $model->id);
                    }
                }
            }
        });
    }
}
