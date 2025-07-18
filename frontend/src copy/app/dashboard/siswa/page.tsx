"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SiswaTable from "@/components/Siswa/SiswaTable";
import EditSiswaDialog from "@/components/Siswa/EditSiswaDialog";
import { api } from "@/lib/api";

export default function SiswaPage() {
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [dataKelas, setDataKelas] = useState<any[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [data, setData] = useState({ nama:"", nis:"", kelas_id:0, jurusan_id:0, pararel_id:0, jenis_kelamin:"", tanggal_lahir:"", alamat:"" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [kelas, siswa] = await Promise.all([api.get("/kelas"), api.get("/siswa")]);
      setDataSiswa(siswa.data.data);
      setDataKelas(kelas.data.data);
    };
    fetchData();
  }, []);

  const handleChange = (key: string, value: string | number) => setData((prev) => ({ ...prev, [key]: value }));
  const resetForm = () => setData({ nama:"", nis:"", kelas_id:0, jurusan_id:0, pararel_id:0, jenis_kelamin:"", tanggal_lahir:"", alamat:"" });

  const handleAdd = async () => {
    try {
      const res = await api.post("/siswa", data);
      setDataSiswa((prev) => [...prev, res.data.data]);
      setAddDialogOpen(false); resetForm();
    } catch (e) { console.log(e); }
  };

  const handleEdit = (siswa: any) => {
    setData(siswa); setEditingId(siswa.id); setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (editingId) {
      try {
        const res = await api.put(`/siswa/${editingId}`, data);
        setDataSiswa((prev) => prev.map((s) => s.id === editingId ? res.data.data : s));
        setEditDialogOpen(false); setEditingId(null); resetForm();
      } catch (e) { console.log(e); }
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/siswa/${id}`);
    setDataSiswa((prev) => prev.filter((s) => s.id !== id));
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
