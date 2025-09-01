"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import KelasTable from "@/components/Kelas/KelasTable";
import AddKelasDialog from "@/components/Kelas/AddKelasDialog";
import EditKelasDialog from "@/components/Kelas/EditKelasDialog";
import { Kelas } from "@/types";

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([
    { id: 1, kelas: "XII RPL 1" },
    { id: 2, kelas: "XII RPL 2" },
  ]);

  const [form, setForm] = useState<{ kelas: string }>({ kelas: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    const newKelas: Kelas = {
      id: Date.now(),
      kelas: form.kelas,
    };
    setKelas((prev) => [...prev, newKelas]);
    setAddDialogOpen(false);
    setForm({ kelas: "" });
  };

  const handleEditClick = (item: Kelas) => {
    setEditingId(item.id);
    setForm({ kelas: item.kelas });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingId !== null) {
      setKelas((prev) =>
        prev.map((k) => (k.id === editingId ? { ...k, kelas: form.kelas } : k))
      );
      setEditDialogOpen(false);
      setEditingId(null);
      setForm({ kelas: "" });
    }
  };

  const handleDelete = (id: number) => {
    setKelas((prev) => prev.filter((k) => k.id !== id));
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
