'use client';

import { useState } from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { Pelanggaran } from '@/types'; // pastikan import sesuai path kamu

interface AddPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (violation: Omit<Pelanggaran, 'id'>) => void;
}

export default function AddPelanggaranDialog({
  open, onOpenChange, onAdd
}: AddPelanggaranDialogProps) {
  const [form, setForm] = useState<Omit<Pelanggaran, 'id'>>({
    siswa_id: 0,
    dilaporkan_oleh_id: 0,
    jenis_pelanggaran: "",
    tingkat: "",
    poin: "0",
    tanggal: "",
    waktu: "",
    lokasi: "",
    deskripsi: "",
    status: "Aktif",
    tindakan: "",
    tanggal_tindak_lanjut: "",
    catatan: "",
    created_at: "",
    updated_at: "",
    siswa: {} as any,             // dummy sementara
    dilaporkan_oleh: {} as any    // dummy sementara
  });

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      siswa_id: 0,
      dilaporkan_oleh_id: 0,
      jenis_pelanggaran: "",
      tingkat: "",
      poin: "0",
      tanggal: "",
      waktu: "",
      lokasi: "",
      deskripsi: "",
      status: "Aktif",
      tindakan: "",
      tanggal_tindak_lanjut: "",
      catatan: "",
      created_at: "",
      updated_at: "",
      siswa: {} as any,
      dilaporkan_oleh: {} as any
    });
  };

  const handleSubmit = () => {
    onAdd(form);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">+ Tambah Pelanggaran</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Jenis Pelanggaran</Label>
            <Input value={form.jenis_pelanggaran} onChange={e => handleChange("jenis_pelanggaran", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tingkat</Label>
            <Select value={form.tingkat} onValueChange={v => handleChange("tingkat", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ringan">Ringan</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Berat">Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Poin</Label>
            <Input type="number" value={form.poin} onChange={e => handleChange("poin", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" value={form.tanggal} onChange={e => handleChange("tanggal", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Waktu</Label>
            <Input type="time" value={form.waktu} onChange={e => handleChange("waktu", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input value={form.lokasi} onChange={e => handleChange("lokasi", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input value={form.deskripsi} onChange={e => handleChange("deskripsi", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={resetForm}>Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
