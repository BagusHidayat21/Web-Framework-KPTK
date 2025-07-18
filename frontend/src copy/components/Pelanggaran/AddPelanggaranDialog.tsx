'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type Violation } from './PelanggaranTable';

interface AddPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (violation: Omit<Violation, 'id'>) => void;
}

const AddPelanggaranDialog = ({ open, onOpenChange, onAdd }: AddPelanggaranDialogProps) => {
  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    class: "",
    violationType: "",
    severity: "",
    points: 0,
    date: "",
    description: "",
    status: "Aktif",
  });

  const handleChange = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      studentName: "",
      studentId: "",
      class: "",
      violationType: "",
      severity: "",
      points: 0,
      date: "",
      description: "",
      status: "Aktif",
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
      <DialogContent className='w-full max-w-[90vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Tambah Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="add-studentName">Nama Siswa</Label>
            <Input
              id="add-studentName"
              placeholder="Nama Siswa"
              value={form.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-studentId">NIS</Label>
            <Input
              id="add-studentId"
              placeholder="NIS"
              value={form.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-class">Kelas</Label>
            <Input
              id="add-class"
              placeholder="Kelas"
              value={form.class}
              onChange={(e) => handleChange("class", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-violationType">Jenis Pelanggaran</Label>
            <Input
              id="add-violationType"
              placeholder="Jenis Pelanggaran"
              value={form.violationType}
              onChange={(e) => handleChange("violationType", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-severity">Tingkat</Label>
            <Select value={form.severity} onValueChange={(v) => handleChange("severity", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ringan">Ringan</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Berat">Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-points">Poin</Label>
            <Input
              id="add-points"
              placeholder="Poin"
              type="number"
              value={form.points}
              onChange={(e) => handleChange("points", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-date">Tanggal</Label>
            <Input
              id="add-date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-description">Deskripsi</Label>
            <Input
              id="add-description"
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
};

export default AddPelanggaranDialog;