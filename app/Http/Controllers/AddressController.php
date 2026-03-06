<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\Village;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;

class AddressController extends Controller
{
    public function provinces()
    {
        return Province::select('id', 'code', 'name')->get();
    }

    public function cities(Request $request)
    {
        $request->validate([
            'province_code' => 'required|string|size:2',
        ]);

        return City::where('province_code', $request->province_code)
                ->select('id', 'code', 'name')->get();
    }

    public function districts(Request $request)
    {
        $request->validate([
            'city_code' => 'required|string|size:4',
        ]);

        return District::where('city_code', $request->city_code)
                    ->select('id', 'code', 'name')->get();
    }

    public function villages(Request $request)
    {
        $request->validate([
            'district_code' => 'required|string|min:6|max:7',
        ]);

        return Village::where('district_code', $request->district_code)
                    ->select('id', 'code', 'name')->get();
    }
}

