'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type Violation } from './PelanggaranTable';

interface EditPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation: Violation | null;
  onUpdate: (updated: Violation & { updated_by: number }) => void;
}

export default function EditPelanggaranDialog({
  open,
  onOpenChange,
  violation,
  onUpdate
}: EditPelanggaranDialogProps) {
  const [form, setForm] = useState({
    jenis_pelanggaran: '',
    tingkat: '',
    poin: 0,
    tanggal: '',
    deskripsi: '',
    status: 'Aktif'
  });

  useEffect(() => {
    if (violation) {
      setForm({
        jenis_pelanggaran: violation.jenis_pelanggaran,
        tingkat: violation.tingkat,
        poin: violation.poin,
        tanggal: violation.tanggal,
        deskripsi: violation.deskripsi,
        status: violation.status
      });
    }
  }, [violation?.id]);

  const handleChange = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (violation) {
      const updatedBy = parseInt(localStorage.getItem('user_id') || '1'); // ganti sesuai field / token
      onUpdate({
        ...violation,
        ...form,
        deskripsi: form.deskripsi || violation.deskripsi,  // fallback deskripsi lama
        updated_by: updatedBy
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={violation?.id || 'new'} className="w-full max-w-[min(90vw,500px)] max-h-[calc(100vh-10rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nama Siswa</Label>
            <Input value={violation?.siswa?.nama || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>NIS</Label>
            <Input value={violation?.siswa?.nis || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Kelas</Label>
            <Input value={violation?.siswa?.kelas_id ? String(violation.siswa.kelas_id) : ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Jenis Pelanggaran</Label>
            <Input value={form.jenis_pelanggaran} onChange={e => handleChange('jenis_pelanggaran', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tingkat</Label>
            <Select value={form.tingkat} onValueChange={v => handleChange('tingkat', v)}>
              <SelectTrigger><SelectValue placeholder="Tingkat" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Ringan">Ringan</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Berat">Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Poin</Label>
            <Input type="number" value={form.poin} onChange={e => handleChange('poin', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" value={form.tanggal} onChange={e => handleChange('tanggal', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input value={form.deskripsi} onChange={e => handleChange('deskripsi', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
