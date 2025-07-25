"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddKelasDialog({
  open,
  setOpen,
  form,
  handleChange,
  handleAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: { nama: string };
  handleChange: (key: string, value: string) => void;
  handleAdd: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">Tambah Kelas</Button>
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
  );
}
