<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pelanggaran;
use App\Models\Bukti_Pelanggaran;

class PelanggaranController extends Controller
{
    public function index()
    {
        $data = Pelanggaran::with(['siswa.kelas', 'pelapor', 'bukti'])->get();
        return response()->json([
            'status' => true,
            'message' => 'Berhasil mengambil data pelanggaran',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $data = Pelanggaran::with(['siswa.kelas', 'pelapor', 'bukti'])->find($id);
        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail pelanggaran berhasil diambil',
            'data' => $data
        ]);
    }
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'siswa_id' => 'required',
            'jenis_pelanggaran' => 'required|string',
            'tingkat' => 'required|string',
            'poin' => 'required|integer',
            'tanggal' => 'required|date',
            'waktu' => 'required|string',
            'lokasi' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'status' => 'nullable|string',
            'tindakan' => 'nullable|string',
            'tanggal_tindak_lanjut' => 'nullable|date',
            'catatan' => 'nullable|string',

            // Validasi untuk file upload
            'bukti_files' => 'nullable|array',
            'bukti_files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240', // Max 10MB

            // Validasi untuk deskripsi bukti
            'bukti_descriptions' => 'nullable|array',
            'bukti_descriptions.*' => 'nullable|string',
        ]);

        try {
            // Buat pelanggaran
            $pelanggaran = Pelanggaran::create([
                'dilaporkan_oleh' => $user->id,
                'siswa_id' => $validated['siswa_id'],
                'jenis_pelanggaran' => $validated['jenis_pelanggaran'],
                'tingkat' => $validated['tingkat'],
                'poin' => $validated['poin'],
                'tanggal' => $validated['tanggal'],
                'waktu' => $validated['waktu'],
                'lokasi' => $validated['lokasi'] ?? null,
                'deskripsi' => $validated['deskripsi'] ?? null,
                'status' => $validated['status'] ?? 'Aktif',
                'tindakan' => $validated['tindakan'] ?? null,
                'tanggal_tindak_lanjut' => $validated['tanggal_tindak_lanjut'] ?? null,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            // Handle file upload untuk bukti
            if ($request->hasFile('bukti_files')) {
                $buktiData = [];
                $files = $request->file('bukti_files');
                $descriptions = $request->input('bukti_descriptions', []);

                foreach ($files as $index => $file) {
                    if ($file->isValid()) {
                        // Generate unique filename
                        $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();

                        // Store file di storage/app/public/bukti
                        $path = $file->storeAs('bukti', $filename, 'public');

                        // Determine file type
                        $mimeType = $file->getMimeType();
                        $tipe = str_starts_with($mimeType, 'image/') ? 'image' : 'file';

                        $buktiData[] = [
                            'tipe' => $tipe,
                            'url' => $path, // Path relatif ke storage
                            'nama' => $file->getClientOriginalName(),
                            'deskripsi' => $descriptions[$index] ?? null,
                            'diunggah_oleh' => $user->name ?? $user->username,
                            'waktu_unggah' => now(),
                            'mime_type' => $mimeType,
                            'size' => $file->getSize(),
                        ];
                    }
                }

                // Simpan bukti ke database
                if (!empty($buktiData)) {
                    $pelanggaran->bukti()->createMany($buktiData);
                }
            }

            // Load relations
            $pelanggaran->load('bukti', 'siswa', 'pelapor');

            return response()->json([
                'status' => true,
                'message' => 'Pelanggaran berhasil ditambahkan',
                'data' => $pelanggaran
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal menyimpan pelanggaran: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $pelanggaran = Pelanggaran::find($id);
        if (!$pelanggaran) {
            return response()->json([
                'status' => false,
                'message' => 'Pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        $validated = $request->validate([
            'jenis_pelanggaran' => 'sometimes|string',
            'tingkat' => 'sometimes|string',
            'poin' => 'sometimes|integer',
            'tanggal' => 'sometimes|date',
            'waktu' => 'sometimes',
            'lokasi' => 'sometimes|string',
            'deskripsi' => 'sometimes|string',
            'status' => 'sometimes|string',
            'tindakan' => 'nullable|string',
            'tanggal_tindak_lanjut' => 'nullable|date',
            'catatan' => 'nullable|string',
        ]);

        $pelanggaran->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Pelanggaran berhasil diperbarui',
            'data' => $pelanggaran
        ]);
    }

    public function destroy($id)
    {
        $pelanggaran = Pelanggaran::find($id);
        if (!$pelanggaran) {
            return response()->json([
                'status' => false,
                'message' => 'Pelanggaran tidak ditemukan',
                'data' => null
            ], 404);
        }

        $pelanggaran->delete();

        return response()->json([
            'status' => true,
            'message' => 'Pelanggaran berhasil dihapus',
            'data' => null
        ]);
    }

    public function getBuktiFile($id)
    {
        $bukti = Bukti_Pelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->file($filePath);
    }

    // Method untuk download file bukti
    public function downloadBuktiFile($id)
    {
        $bukti = Bukti_Pelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->download($filePath, $bukti->nama);
    }

    public function getBuktiImage($id)
    {
        $bukti = Bukti_Pelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        $mimeType = mime_content_type($filePath);
        $content = file_get_contents($filePath);

        return response($content, 200)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . $bukti->nama . '"');
    }
}
