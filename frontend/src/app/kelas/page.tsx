'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/Table';
import ConfirmDeleteDialog from '@/components/DeleteDialog';
import { type ColumnDef } from '@tanstack/react-table';

interface Kelas {
  id: number;
  nama: string;
}

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([
    { id: 1, nama: 'XII RPL 1' },
    { id: 2, nama: 'XI TKJ 2' },
  ]);

  const [form, setForm] = useState({ nama: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    const newId = Math.max(0, ...kelas.map(k => k.id)) + 1;
    setKelas(prev => [...prev, { id: newId, nama: form.nama }]);
    setAddDialogOpen(false);
    setForm({ nama: '' });
  };

  const handleUpdate = () => {
    if (editingId !== null) {
      setKelas(prev =>
        prev.map(k => (k.id === editingId ? { ...k, nama: form.nama } : k))
      );
      setEditDialogOpen(false);
      setEditingId(null);
      setForm({ nama: '' });
    }
  };

  const handleDelete = (id: number) => {
    setKelas(prev => prev.filter(k => k.id !== id));
  };

  const handleEditClick = (k: Kelas) => {
    setEditingId(k.id);
    setForm({ nama: k.nama });
    setEditDialogOpen(true);
  };

  const columns: ColumnDef<Kelas>[] = [
    { header: 'No', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'nama', header: 'Nama' },
    {
      header: 'Aksi',
      cell: ({ row }) => {
        const k = row.original;
        return (
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              className="bg-yellow-300 text-white hover:bg-yellow-400"
              onClick={() => handleEditClick(k)}
            >
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Hapus
                </Button>
              </DialogTrigger>
                <ConfirmDeleteDialog onConfirm={() => handleDelete(k.id)} />
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Data Kelas</h1>

      <Card className="p-4 shadow text-center">
        <DataTable
          columns={columns}
          data={kelas}
          actions={
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white">+ Tambah Kelas</Button>
              </DialogTrigger>
              <DialogContent className='w-full max-w-[min(90vw,300px)] max-h-[calc(100vh-10rem)] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>Tambah Kelas</DialogTitle>
                  <DialogDescription>Masukkan nama kelas baru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="nama">Nama</Label>
                  <Input
                    id="nama"
                    value={form.nama}
                    onChange={e => handleChange('nama', e.target.value)}
                    placeholder="Contoh: XII RPL 2"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button onClick={handleAdd}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='w-full max-w-[min(90vw,300px)] max-h-[calc(100vh-10rem)] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="edit-nama">Nama</Label>
            <Input
              id="edit-nama"
              value={form.nama}
              onChange={e => handleChange('nama', e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
