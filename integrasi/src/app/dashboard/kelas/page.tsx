"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import KelasTable from '@/components/Kelas/KelasTable';
import AddKelasDialog from '@/components/Kelas/AddKelasDialog';
import EditKelasDialog from '@/components/Kelas/EditKelasDialog';
import { api } from '@/lib/api';

interface Kelas {
  id: number;
  nama: string;
}

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [form, setForm] = useState({ nama: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    api.get('/kelas').then(res => setKelas(res.data.data));
  }, []);

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAdd = () => {
    api.post('/kelas', { nama: form.nama }).then(res => {
      setKelas(prev => [...prev, res.data.data]);
      setAddDialogOpen(false);
      setForm({ nama: '' });
    });
  };

  const handleUpdate = () => {
    if (editingId) {
      api.put(`/kelas/${editingId}`, { nama: form.nama }).then(res => {
        setKelas(prev => prev.map(k => k.id === editingId ? res.data.data : k));
        setEditDialogOpen(false);
        setEditingId(null);
        setForm({ nama: '' });
      });
    }
  };

  const handleDelete = (id: number) => {
    api.delete(`/kelas/${id}`).then(() => setKelas(prev => prev.filter(k => k.id !== id)));
  };

  const handleEditClick = (k: Kelas) => {
    setEditingId(k.id);
    setForm({ nama: k.nama });
    setEditDialogOpen(true);
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
