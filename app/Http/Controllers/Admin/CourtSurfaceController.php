<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\CourtSurface;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class CourtSurfaceController extends Controller
{
    public function index(Request $request)
    {
        // Buat query builder
        $query = CourtSurface::query();

        // Opsional: filter search
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Ambil data dengan pagination
        $court_surfaces = $query->orderBy('created_at', 'desc')
                                  ->paginate(10)
                                  ->withQueryString();

        return Inertia::render('Admin/MasterData/CourtSurface/Index', [
            'court_surfaces' => $court_surfaces,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'nullable|string|max:255',
        ]);

        $surfaces = CourtSurface::create($validated);

        return response()->json($surfaces);
    }


    public function inlineUpdate(Request $request, $id)
    {
        $surfaces = CourtSurface::findOrFail($id);

        // Validasi court yang akan di-update
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
        ]);

        // Update hanya court yang dikirim
        $surfaces->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data Tipe berhasil diperbarui.',
            'data' => $surfaces,
        ]);
    }

    public function destroy($id)
    {
        $surfaces = CourtSurface::findOrFail($id);

        if ($surfaces->courts()->exists()) {
            return back()->with([
                'surface' => 'error',
                'message' => 'Tipe ini masih digunakan oleh salah satu lapangan.'
            ]);
        }

        $surfaces->courts()->detach();

        $surfaces->delete();

        return back()->with([
            'surface' => 'success',
            'message' => 'Tipe berhasil dihapus.'
        ]);
    }
}
