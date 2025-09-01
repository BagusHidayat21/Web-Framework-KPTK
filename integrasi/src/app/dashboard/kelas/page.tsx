"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import KelasTable from "@/components/Kelas/KelasTable";
import AddKelasDialog from "@/components/Kelas/AddKelasDialog";
import EditKelasDialog from "@/components/Kelas/EditKelasDialog";
import { Kelas } from "@/types";
import { api } from "@/lib/api";

export default function KelasPage() {
  // state untuk menyimpan list kelas dari API
  const [kelas, setKelas] = useState<Kelas[]>([]);

  // state untuk menyimpan form (digunakan di tambah & edit)
  const [form, setForm] = useState<{ kelas: string }>({ kelas: "" });

  // state untuk menyimpan ID yang sedang diedit
  const [editingId, setEditingId] = useState<number | null>(null);

  // state untuk membuka/menutup dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // 🔑 Fungsi ambil data kelas dari API
  const fetchData = async () => {
    try {
      const res = await api.get("/kelas");
      setKelas(res.data.data);
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
    }
  };

  // 🔑 Ambil data pertama kali saat komponen di-mount
  useEffect(() => {
    fetchData();
  }, []);

  // 🔑 Handle perubahan input form (reusable untuk add/edit)
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔑 Tambah data kelas
  const handleAdd = async () => {
    try {
      await api.post("/kelas", { kelas: form.kelas });
      await fetchData(); // ambil ulang biar sinkron dengan DB
      setAddDialogOpen(false);
      setForm({ kelas: "" });
    } catch (error) {
      console.error("❌ Failed to add data:", error);
    }
  };

  // 🔑 Saat klik tombol edit → isi form dengan data kelas
  const handleEditClick = (item: Kelas) => {
    setEditingId(item.id);
    setForm({ kelas: item.kelas });
    setEditDialogOpen(true);
  };

  // 🔑 Update data kelas
  const handleUpdate = async () => {
    if (editingId !== null) {
      try {
        await api.put(`/kelas/${editingId}`, { kelas: form.kelas });
        await fetchData(); // ambil ulang biar konsisten
        setEditDialogOpen(false);
        setEditingId(null);
        setForm({ kelas: "" });
      } catch (error) {
        console.error("❌ Failed to update data:", error);
      }
    }
  };

  // 🔑 Hapus data kelas
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/kelas/${id}`);
      await fetchData(); // ambil ulang setelah delete
    } catch (error) {
      console.error("❌ Failed to delete data:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Data Kelas</h1>
      <Card className="p-4 shadow text-center">
        <KelasTable
          data={kelas}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          addDialog={
            <AddKelasDialog
              open={addDialogOpen}
              setOpen={setAddDialogOpen}
              form={form}
              handleChange={handleChange}
              handleAdd={handleAdd}
            />
          }
        />
      </Card>

      {/* Dialog edit kelas */}
      <EditKelasDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        form={form}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
