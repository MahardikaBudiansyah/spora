<?php

namespace App\Helpers;

class NumberPhoneHelper
{
    /**
     * Normalisasi nomor HP ke format 62xxxxxxxxxx
     */
    public static function normalize(string $phone): string
    {
        // Hilangkan semua karakter non-angka
        $phone = preg_replace('/\D/', '', $phone);

        // Ubah awalan 0 -> 62
        if (preg_match('/^0/', $phone)) {
            $phone = preg_replace('/^0/', '62', $phone);
        }

        // Ubah awalan +62 -> 62
        if (preg_match('/^62/', $phone) === 0 && preg_match('/^\+62/', $phone)) {
            $phone = preg_replace('/^\+62/', '62', $phone);
        }

        return $phone;
    }
}
