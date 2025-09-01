"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SiswaTable from "@/components/Siswa/SiswaTable";
import EditSiswaDialog from "@/components/Siswa/EditSiswaDialog";
import type { Siswa, Kelas } from "@/types"; // pakai tipe buatanmu

export default function SiswaPage() {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [dataKelas, setDataKelas] = useState<Kelas[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [data, setData] = useState<Omit<Siswa, 'id' | 'created_at' | 'updated_at' | 'kelas'>>({
    nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    // Dummy data only
    const dummyKelas: Kelas[] = [
      { id: 1, kelas: "XII RPL 1"},
      { id: 2, kelas: "XII RPL 2"}
    ];
    const dummySiswa: Siswa[] = [
      { id: 1, nis: "12345", nama: "Budi", kelas_id: 1, jenis_kelamin: "Laki-Laki", tanggal_lahir: "2006-01-01", alamat: "Jl. Mawar", kelas: dummyKelas[0] },
      { id: 2, nis: "12346", nama: "Siti", kelas_id: 2, jenis_kelamin: "Perempuan", tanggal_lahir: "2006-02-01", alamat: "Jl. Melati", kelas: dummyKelas[1] }
    ];
    setDataKelas(dummyKelas);
    setDataSiswa(dummySiswa);
  }, []);

  const handleChange = (key: string, value: string | number) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const resetForm = () =>
    setData({ nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: "" });

  const handleAdd = () => {
    const newId = dataSiswa.length ? Math.max(...dataSiswa.map(s => s.id)) + 1 : 1;
    const kelasObj = dataKelas.find(k => k.id === data.kelas_id) || dataKelas[0];
    const newSiswa: Siswa = {
      id: newId,
      ...data,
      kelas: kelasObj
    };
    setDataSiswa(prev => [...prev, newSiswa]);
    setAddDialogOpen(false);
    resetForm();
  };

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

  const handleUpdate = () => {
    if (editingId) {
      const updatedSiswa: Siswa[] = dataSiswa.map((s) =>
        s.id === editingId
          ? {
              ...s,
              ...data,
              updated_at: new Date().toISOString(),
              kelas: dataKelas.find(k => k.id === data.kelas_id) || s.kelas
            }
          : s
      );
      setDataSiswa(updatedSiswa);
      setEditDialogOpen(false);
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = (id: number) => {
    setDataSiswa(prev => prev.filter(s => s.id !== id));
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
