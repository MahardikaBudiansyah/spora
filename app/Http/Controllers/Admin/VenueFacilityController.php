<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Controller;
use App\Models\VenueFacility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VenueFacilityController extends Controller
{
    public function index(Request $request)
    {
        $query = VenueFacility::query();

        if ($request->search) {
            $query->where('label', 'like', "%{$request->search}%");
        }

        $venue_facilities = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/MasterData/VenueFacility/Index', [
            'venue_facilities' => $venue_facilities,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'nullable|string|max:255',
            'label' => 'nullable|string|max:255',
        ]);

        $category = VenueFacility::create($validated);

        return response()->json($category);
    }


    public function inlineUpdate(Request $request, $id)
    {
        $category = VenueFacility::findOrFail($id);

        // Validasi field yang akan di-update
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'label' => 'sometimes|string|max:255',
        ]);

        // Update hanya field yang dikirim
        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diperbarui.',
            'data' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = VenueFacility::findOrFail($id);

        if ($category->fields()->exists()) {
            return back()->with([
                'type' => 'error',
                'message' => 'Kategori ini masih digunakan oleh salah satu lapangan.'
            ]);
        }


        $category->fields()->detach();

        // Baru hapus kategori
        $category->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Kategori berhasil dihapus.'
        ]);
    }
}
