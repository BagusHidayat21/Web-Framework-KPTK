'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
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

interface EditPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation: Violation | null;
  onUpdate: (violation: Violation) => void;
}

const EditPelanggaranDialog = ({ open, onOpenChange, violation, onUpdate }: EditPelanggaranDialogProps) => {
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

  useEffect(() => {
    if (violation) {
      setForm({
        studentName: violation.studentName,
        studentId: violation.studentId,
        class: violation.class,
        violationType: violation.violationType,
        severity: violation.severity,
        points: violation.points,
        date: violation.date,
        description: violation.description,
        status: violation.status,
      });
    }
  }, [violation]);

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
    if (violation) {
      onUpdate({
        ...violation,
        ...form,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[min(90vw,500px)] max-h-[calc(100vh-10rem)] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-studentName">Nama Siswa</Label>
            <Input
              id="edit-studentName"
              placeholder="Nama Siswa"
              value={form.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-studentId">NIS</Label>
            <Input
              id="edit-studentId"
              placeholder="NIS"
              value={form.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-class">Kelas</Label>
            <Input
              id="edit-class"
              placeholder="Kelas"
              value={form.class}
              onChange={(e) => handleChange("class", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-violationType">Jenis Pelanggaran</Label>
            <Input
              id="edit-violationType"
              placeholder="Jenis Pelanggaran"
              value={form.violationType}
              onChange={(e) => handleChange("violationType", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-severity">Tingkat</Label>
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
            <Label htmlFor="edit-points">Poin</Label>
            <Input
              id="edit-points"
              placeholder="Poin"
              type="number"
              value={form.points}
              onChange={(e) => handleChange("points", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Tanggal</Label>
            <Input
              id="edit-date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Input
              id="edit-description"
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

export default EditPelanggaranDialog;