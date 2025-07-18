"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FormFields from "@/components/FormFields";
import { DataTable } from "@/components/Table";
import ConfirmDeleteDialog from "@/components/DeleteDialog";

import { useState } from "react";

interface Siswa {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  kelas_id: number;
  jurusan: string;
  jurusan_id: number;
  pararel: string;
  pararel_id: number;
  jenis_kelamin: string;
  tanggal_lahir: string;
  alamat: string;
}

interface Kelas {
  id: number;
  nama: string;
}
interface Jurusan {
  id: number;
  nama: string;
}
interface Pararel {
  id: number;
  nama: string;
}

const dummyKelas: Kelas[] = [{ id: 1, nama: "XII RPL 1" }];
const dummyJurusan: Jurusan[] = [{ id: 1, nama: "Rekayasa Perangkat Lunak" }];
const dummyPararel: Pararel[] = [{ id: 1, nama: "A" }];
const dummySiswa: Siswa[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
  {
    id: 1,
    nama: "Budi Santoso",
    nis: "123456",
    kelas: "XII",
    kelas_id: 1,
    jurusan: "RPL",
    jurusan_id: 1,
    pararel: "A",
    pararel_id: 1,
    jenis_kelamin: "L",
    tanggal_lahir: "2006-02-14",
    alamat: "Jl. Contoh No. 1",
  },
];

export default function SiswaPage() {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>(dummySiswa);
  const [data, setData] = useState({
    nama: "",
    nis: "",
    kelas_id: 0,
    jurusan_id: 0,
    pararel_id: 0,
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleChange = (key: string, value: string | number) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    const newId = dataSiswa.length + 1;
    const newSiswa: Siswa = {
      id: newId,
      ...data,
      kelas: dummyKelas.find((k) => k.id === data.kelas_id)?.nama || "",
      jurusan: dummyJurusan.find((j) => j.id === data.jurusan_id)?.nama || "",
      pararel: dummyPararel.find((p) => p.id === data.pararel_id)?.nama || "",
    } as Siswa;
    setDataSiswa((prev) => [...prev, newSiswa]);
    setAddDialogOpen(false);
    resetForm();
  };

  const handleUpdate = () => {
    if (editingId) {
      setDataSiswa((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                ...data,
                kelas:
                  dummyKelas.find((k) => k.id === data.kelas_id)?.nama || "",
                jurusan:
                  dummyJurusan.find((j) => j.id === data.jurusan_id)?.nama ||
                  "",
                pararel:
                  dummyPararel.find((p) => p.id === data.pararel_id)?.nama ||
                  "",
              }
            : s
        )
      );
      setEditDialogOpen(false);
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = (id: number) => {
    setDataSiswa((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (siswa: Siswa) => {
    setData({
      nama: siswa.nama,
      nis: siswa.nis,
      kelas_id: siswa.kelas_id,
      jurusan_id: siswa.jurusan_id,
      pararel_id: siswa.pararel_id,
      jenis_kelamin: siswa.jenis_kelamin,
      tanggal_lahir: siswa.tanggal_lahir,
      alamat: siswa.alamat,
    });
    setEditingId(siswa.id);
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setData({
      nama: "",
      nis: "",
      kelas_id: 0,
      jurusan_id: 0,
      pararel_id: 0,
      jenis_kelamin: "",
      tanggal_lahir: "",
      alamat: "",
    });
  };

  const columns = [
    { 
      header: "No", 
      cell: ({ row }: any) => (
        <div className="text-center">{row.index + 1}</div>
      )
    },
    { accessorKey: "nama", header: "Nama" },
    { 
      accessorKey: "nis", 
      header: "NIS",
      cell: ({ row }: any) => (
        <div className="text-center">{row.original.nis}</div>
      )
    },
    {
      accessorFn: (row: Siswa) => `${row.kelas} ${row.jurusan} ${row.pararel}`,
      header: "Kelas",
      cell: ({ row }: any) => (
        <div className="text-center">{`${row.original.kelas} ${row.original.jurusan} ${row.original.pararel}`}</div>
      )
    },
    { 
      accessorKey: "jenis_kelamin", 
      header: "Jenis Kelamin",
      cell: ({ row }: any) => (
        <div className="text-center">{row.original.jenis_kelamin}</div>
      )
    },
    { 
      accessorKey: "tanggal_lahir", 
      header: "Tanggal Lahir",
      cell: ({ row }: any) => (
        <div className="text-center">{row.original.tanggal_lahir}</div>
      )
    },
    {
      header: "Aksi",
      cell: ({ row }: any) => {
        const siswa = row.original as Siswa;
        return (
          <div className="flex gap-2 justify-center items-center text-center">
            <Button onClick={() => handleEdit(siswa)} className="bg-yellow-300">
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-red-500 text-white">Hapus</Button>
              </DialogTrigger>
                <ConfirmDeleteDialog onConfirm={() => handleDelete(siswa.id)} />
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Data Siswa</h1>

      <Card className="p-4">
        <DataTable
          columns={columns}
          data={dataSiswa}
          actions={
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white">
                  + Tambah Siswa
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[min(90vw,300px)] max-h-[calc(100vh-10rem)] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Siswa</DialogTitle>
                  <DialogDescription>
                    Isi form untuk menambahkan siswa.
                  </DialogDescription>
                </DialogHeader>
                <FormFields
                  data={data}
                  onChange={handleChange}
                  kelas={dummyKelas}
                  jurusan={dummyJurusan}
                  pararel={dummyPararel}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleAdd}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="w-full max-w-[min(90vw,300px)] max-h-[calc(100vh-10rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
          </DialogHeader>
          <FormFields
            data={data}
            onChange={handleChange}
            kelas={dummyKelas}
            jurusan={dummyJurusan}
            pararel={dummyPararel}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-yellow-400 text-white" onClick={handleUpdate}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}