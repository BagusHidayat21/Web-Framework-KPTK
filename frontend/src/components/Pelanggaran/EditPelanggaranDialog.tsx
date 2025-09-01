'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { Pelanggaran } from '@/types'; // pastikan path sesuai

interface EditPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation: Pelanggaran | null;
  onUpdate: (violation: Pelanggaran) => void;
}

export default function EditPelanggaranDialog({
  open, onOpenChange, violation, onUpdate
}: EditPelanggaranDialogProps) {
  // form state pakai subset dari Pelanggaran
  const [form, setForm] = useState({
    jenis_pelanggaran: '',
    tingkat: '',
    poin: '0',
    tanggal: '',
    waktu: '',
    lokasi: '',
    deskripsi: '',
    status: 'Aktif',
  });

  // isi form saat violation berubah
  useEffect(() => {
    if (violation) {
      setForm({
        jenis_pelanggaran: violation.jenis_pelanggaran,
        tingkat: violation.tingkat,
        poin: violation.poin,
        tanggal: violation.tanggal,
        waktu: violation.waktu,
        lokasi: violation.lokasi,
        deskripsi: violation.deskripsi,
        status: violation.status,
      });
    }
  }, [violation]);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      jenis_pelanggaran: '',
      tingkat: '',
      poin: '0',
      tanggal: '',
      waktu: '',
      lokasi: '',
      deskripsi: '',
      status: 'Aktif',
    });
  };

  const handleSubmit = () => {
    if (violation) {
      onUpdate({
        ...violation,
        ...form
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(90vw,500px)] max-h-[calc(100vh-10rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Jenis Pelanggaran</Label>
            <Input
              value={form.jenis_pelanggaran}
              onChange={e => handleChange('jenis_pelanggaran', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tingkat</Label>
            <Select value={form.tingkat} onValueChange={v => handleChange('tingkat', v)}>
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
            <Input
              type="number"
              value={form.poin}
              onChange={e => handleChange('poin', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={form.tanggal}
              onChange={e => handleChange('tanggal', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Waktu</Label>
            <Input
              type="time"
              value={form.waktu}
              onChange={e => handleChange('waktu', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input
              value={form.lokasi}
              onChange={e => handleChange('lokasi', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input
              value={form.deskripsi}
              onChange={e => handleChange('deskripsi', e.target.value)}
            />
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