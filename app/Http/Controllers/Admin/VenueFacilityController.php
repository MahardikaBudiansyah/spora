<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;

class VenueFacilityController extends Controller
{
    public function index(Request $request)
    {
        // Buat query builder
        $query = FieldCategory::query();

        // Opsional: filter search
        if ($request->search) {
            $query->where('label', 'like', "%{$request->search}%");
        }

        // Ambil data dengan pagination
        $field_categories = $query->orderBy('created_at', 'desc')
                                  ->paginate(10)
                                  ->withQueryString();

        return Inertia::render('Admin/MasterData/FieldCategory/Index', [
            'field_categories' => $field_categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'nullable|string|max:255',
            'label' => 'nullable|string|max:255',
        ]);

        $category = FieldCategory::create($validated);

        return response()->json($category);
    }


    public function inlineUpdate(Request $request, $id)
    {
        $category = FieldCategory::findOrFail($id);

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
        $category = FieldCategory::findOrFail($id);

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
