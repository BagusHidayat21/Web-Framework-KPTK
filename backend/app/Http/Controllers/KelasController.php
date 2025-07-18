<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengambil Data Kelas',
            'data' =>  $kelas
        ]);
    }

    public function show($id)
    {
        $kelas = Kelas::find($id);
        if (!$kelas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kelas Tidak Ditemukan'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengambil Data Kelas',
            'data' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $kelas = Kelas::create($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Menambahkan Data Kelas',
            'data' => $kelas
        ]);
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::find($id);
        if (!$kelas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kelas Tidak Ditemukan'
            ]);
        }
        $kelas->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengubah Data Kelas',
            'data' => $kelas
        ]);
    }

    public function destroy($id)
    {
        $kelas = Kelas::find($id);
        if (!$kelas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kelas Tidak Ditemukan'
            ]);
        }
        $kelas->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Menghapus Data Kelas',
            'data' => $kelas
        ]);
    }
}
