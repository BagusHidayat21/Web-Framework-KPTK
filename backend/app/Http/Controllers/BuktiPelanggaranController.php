<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bukti_Pelanggaran;

class Bukti_PelanggaranController extends Controller
{
    public function index()
    {
        $data = Bukti_Pelanggaran::with('pelanggaran')->get();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil mengambil data bukti pelanggaran',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $data = Bukti_Pelanggaran::with('pelanggaran')->find($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Bukti pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail bukti pelanggaran berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pelanggaran_id' => 'required|exists:pelanggarans,id',
            'tipe' => 'required|string',
            'url' => 'required|string',
            'deskripsi' => 'nullable|string',
            'nama' => 'nullable|string',
            'diunggah_oleh' => 'nullable|string',
            'waktu_unggah' => 'nullable|date',
        ]);

        $bukti = Bukti_Pelanggaran::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Bukti pelanggaran berhasil ditambahkan',
            'data' => $bukti
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $bukti = Bukti_Pelanggaran::find($id);

        if (!$bukti) {
            return response()->json([
                'status' => false,
                'message' => 'Bukti pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        $validated = $request->validate([
            'tipe' => 'sometimes|string',
            'url' => 'sometimes|string',
            'deskripsi' => 'nullable|string',
            'nama' => 'nullable|string',
            'diunggah_oleh' => 'nullable|string',
            'waktu_unggah' => 'nullable|date',
        ]);

        $bukti->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Bukti pelanggaran berhasil diperbarui',
            'data' => $bukti
        ]);
    }

    public function destroy($id)
    {
        $bukti = Bukti_Pelanggaran::find($id);

        if (!$bukti) {
            return response()->json([
                'status' => false,
                'message' => 'Bukti pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        $bukti->delete();

        return response()->json([
            'status' => true,
            'message' => 'Bukti pelanggaran berhasil dihapus',
            'data' => null
        ]);
    }
}
