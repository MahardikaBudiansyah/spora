<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Court;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;
use App\Http\Resources\CourtResource;

class CourtController extends Controller
{
    public function index(Request $request)
    {
        $courts = Court::with(['venue.merchant', 'surface', 'categories'])
            ->orderBy('created_at', 'asc')
            ->paginate(10);

        return Inertia::render('Admin/Courts/Index', [
            'courts' => CourtResource::collection($courts)->response()->getData(true),
        ]);
    }

    public function show(Venue $venue, Court $court)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $court);

        $court->load([
            'timeSlots',
            'surface',
            'categories',
            'images',
        ]);

        return Inertia::render('Admin/Venues/Courts/Show', [
            'venue' => $venue,
            'court' => new CourtResource($court),
        ]);
    }
}
