<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;

class SiswaController extends Controller
{
    public function index()
    {
        $siswas = Siswa::with('kelas')->get();
        return response()->json([
            'status' => 'success',
            'message' => 'berhasil mengambil semua data',
            'data'=> $siswas
        ]);
    }

    public function show($id)
    {
        $siswa = Siswa::with('kelas')->find($id);
        return response()->json([
            'status' => 'success',
            'message' => 'berhasil mengambil data',
            'data'=> $siswa
        ]);
    }

    public function store(Request $request)
    {
        $siswa = Siswa::create($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'berhasil menambahkan data',
            'data'=> $siswa
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::find($id);
        $siswa->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'berhasil mengubah data',
            'data'=> $siswa
        ]);
    }

    public function destroy($id)
    {
        $siswa = Siswa::find($id);
        $siswa->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'berhasil menghapus data',
            'data'=> $siswa
        ]);
    }

}
