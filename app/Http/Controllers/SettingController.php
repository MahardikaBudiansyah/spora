<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Venue;
use Illuminate\Http\Request;

class SettingController extends Controller
{

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);
        

        return Inertia::render('Merchant/Venue/Setting/Index', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }
    
}
