"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SiswaTable from "@/components/Siswa/SiswaTable";
import EditSiswaDialog from "@/components/Siswa/EditSiswaDialog";
import type { Siswa, Kelas } from "@/types"; // pakai tipe buatanmu
import { api } from "@/lib/api";
import { Award } from "lucide-react";

export default function SiswaPage() {
  // State untuk menyimpan data siswa
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  // State untuk menyimpan data kelas
  const [dataKelas, setDataKelas] = useState<Kelas[]>([]);
  // Filter kelas yang dipilih
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  // State untuk form tambah/edit siswa
  const [data, setData] = useState<Omit<Siswa, 'id' | 'created_at' | 'updated_at' | 'kelas'>>({
    nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: ""
  });
  // Menyimpan ID siswa yang sedang di-edit
  const [editingId, setEditingId] = useState<number | null>(null);
  // Toggle untuk dialog edit siswa
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // Toggle untuk dialog tambah siswa
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // 🔑 useEffect untuk fetch data awal (siswa & kelas) dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siswaRes, kelasRes] = await Promise.all([
          api.get('/siswa'),
          api.get('/kelas')
        ]);
        const siswaData = siswaRes.data.data;
        const kelasData = kelasRes.data.data;
  
        setDataSiswa(siswaData); // simpan ke state
        setDataKelas(kelasData); // simpan ke state
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // 🔑 Fungsi untuk mengubah isi form
  const handleChange = (key: string, value: string | number) =>
    setData((prev) => ({ ...prev, [key]: value }));

  // 🔑 Reset form setelah tambah/edit
  const resetForm = () =>
    setData({ nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: "" });

  // 🔑 Tambah siswa baru
  const handleAdd = async() => {
    await api.post('/siswa', data); // simpan ke server
    const newId = dataSiswa.length ? Math.max(...dataSiswa.map(s => s.id)) + 1 : 1; // ambil ID baru
    const kelasObj = dataKelas.find(k => k.id === data.kelas_id) || dataKelas[0];
    const newSiswa: Siswa = { id: newId, ...data, kelas: kelasObj };
    setDataSiswa(prev => [...prev, newSiswa]); // update state lokal
    setAddDialogOpen(false);
    resetForm();
  };

  // 🔑 Masukkan data siswa yang dipilih ke form edit
  const handleEdit = (siswa: Siswa) => {
    setData({
      nama: siswa.nama,
      nis: siswa.nis,
      kelas_id: siswa.kelas_id,
      jenis_kelamin: siswa.jenis_kelamin,
      tanggal_lahir: siswa.tanggal_lahir,
      alamat: siswa.alamat
    });
    setEditingId(siswa.id);
    setEditDialogOpen(true);
  };

  // 🔑 Update data siswa
  const handleUpdate = async() => {
    if (editingId) {
      try {
        await api.put(`/siswa/${editingId}`, data); // update ke server
        const updatedSiswa = dataSiswa.map((s) => (s.id === editingId ? { ...s, ...data } : s));
        setEditDialogOpen(false);
        setEditingId(null);
        resetForm();
        setDataSiswa(updatedSiswa); // update state lokal
      } catch (error) {
        console.error('Gagal mengupdate siswa:', error);
      }
    }
  };

  // 🔑 Hapus siswa
  const handleDelete = (id: number) => {
    api.delete(`/siswa/${id}`); // hapus di server
    setDataSiswa(prev => prev.filter(s => s.id !== id)); // update state lokal
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Siswa</h1>
      <Card className="p-4">
        <SiswaTable
          dataSiswa={dataSiswa}
          dataKelas={dataKelas}
          selectedKelasId={selectedKelasId}
          setSelectedKelasId={setSelectedKelasId}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          data={data}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
      </Card>
      {/* 🔑 Dialog edit siswa */}
      <EditSiswaDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        data={data}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        dataKelas={dataKelas}
      />
    </div>
  );
}
