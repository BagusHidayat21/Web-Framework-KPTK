"use client";

import { DataTable } from "@/components/Layout/Table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import FormFields from "@/components/Layout/FormFields";
import ConfirmDeleteDialog from "@/components/Layout/DeleteDialog";
import AddSiswaDialog from "@/components/Siswa/AddSiswaDialog";

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

export default function SiswaTable({
  dataSiswa,
  dataKelas,
  selectedKelasId,
  setSelectedKelasId,
  handleEdit,
  handleDelete,
  addDialogOpen,
  setAddDialogOpen,
  data,
  handleChange,
  handleAdd
}: {
  dataSiswa: Siswa[];
  dataKelas: Kelas[];
  selectedKelasId: number | null;
  setSelectedKelasId: (id: number | null) => void;
  handleEdit: (siswa: Siswa) => void;
  handleDelete: (id: number) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (v: boolean) => void;
  data: any;
  handleChange: (key: string, value: string | number) => void;
  handleAdd: () => void;
}) {
  const filteredSiswa = selectedKelasId
    ? dataSiswa.filter((s) => s.kelas_id === selectedKelasId)
    : dataSiswa;

  const columns = [
    { header: "No", cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div> },
    { accessorKey: "nama", header: "Nama" },
    { accessorKey: "nis", header: "NIS", cell: ({ row }: any) => <div className="text-center">{row.original.nis}</div> },
    {
      header: "Kelas",
      cell: ({ row }: any) => (
        <div className="text-center">{dataKelas.find((k) => k.id === row.original.kelas_id)?.nama}</div>
      ),
    },
    { accessorKey: "jenis_kelamin", header: "Jenis Kelamin", cell: ({ row }: any) => <div className="text-center">{row.original.jenis_kelamin}</div> },
    { accessorKey: "tanggal_lahir", header: "Tanggal Lahir", cell: ({ row }: any) => <div className="text-center">{row.original.tanggal_lahir}</div> },
    {
      header: "Aksi",
      cell: ({ row }: any) => {
        const siswa = row.original as Siswa;
        return (
          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => handleEdit(siswa)} className="bg-yellow-300">Edit</Button>
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
    <DataTable
      columns={columns}
      data={filteredSiswa}
      filterByKelas={
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by Kelas:</label>
          <select
            value={selectedKelasId ?? ""}
            onChange={(e) => setSelectedKelasId(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kelas</option>
            {dataKelas.map((kelas) => (
              <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
            ))}
          </select>
        </div>
      }
      actions={
        <AddSiswaDialog
          open={addDialogOpen}
          setOpen={setAddDialogOpen}
          data={data}
          handleChange={handleChange}
          handleAdd={handleAdd}
          dataKelas={dataKelas}
        />
      }
    />
  );
}
