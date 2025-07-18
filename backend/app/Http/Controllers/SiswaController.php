<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;

class SiswaController extends Controller
{
    public function index()
    {
        Siswa::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengambil Data Siswa',
            'data' => Siswa::all()
        ]);
    }

    public function show($id)
    {
        $Siswa = Siswa::find($id);
        if (!$Siswa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Siswa Tidak Ditemukan'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengambil Data Siswa',
            'data' => $Siswa
        ]);
    }

    public function store(Request $request)
    {
        $Siswa = Siswa::create($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Menambahkan Data Siswa',
            'data' => $Siswa
        ]);
    }

    public function update(Request $request, $id)
    {
        $Siswa = Siswa::find($id);
        if (!$Siswa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Siswa Tidak Ditemukan'
            ]);
        }
        $Siswa->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Mengubah Data Siswa',
            'data' => $Siswa
        ]);
    }

    public function destroy($id)
    {
        $Siswa = Siswa::find($id);
        if (!$Siswa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Siswa Tidak Ditemukan'
            ]);
        }
        $Siswa->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Menghapus Data Siswa',
            'data' => $Siswa
        ]);
    }
}
