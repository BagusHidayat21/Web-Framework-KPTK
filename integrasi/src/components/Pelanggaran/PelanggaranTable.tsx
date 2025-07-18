"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmDeleteDialog from "@/components/Layout/DeleteDialog";
import Link from "next/link";
import { useState } from "react";

export interface Violation {
  id: number;
  siswa_id: number;
  jenis_pelanggaran: string;
  tingkat: string;
  poin: number;
  tanggal: string;
  deskripsi: string;
  status: string;
  siswa?: { id: number; nama: string; nis: string; kelas_id: number };
}

interface Kelas {
  id: number;
  nama: string;
  tingkat: string;
}

interface PelanggaranTableProps {
  violations: Violation[];
  kelasList: Kelas[];
  onEdit: (violation: Violation) => void;
  onDelete: (id: number) => void;
  pageSize: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PelanggaranTable({
  violations,
  kelasList,
  onEdit,
  onDelete,
  pageSize,
  page,
  setPage,
}: PelanggaranTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const totalPages = Math.max(1, Math.ceil(violations.length / pageSize));
  const paginated = violations.slice((page - 1) * pageSize, page * pageSize);

  const getSeverityColor = (s: string) =>
    s === "Ringan"
      ? "bg-green-100 text-green-800"
      : s === "Sedang"
      ? "bg-yellow-100 text-yellow-800"
      : s === "Berat"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  const getStatusColor = (s: string) =>
    s === "Aktif"
      ? "bg-orange-100 text-orange-800"
      : s === "Selesai"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="space-y-4 mt-4">
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">Nama Siswa</th>
              <th className="p-2">NIS</th>
              <th className="p-2">Kelas</th>
              <th className="p-2">Jenis Pelanggaran</th>
              <th className="p-2">Tingkat</th>
              <th className="p-2">Poin</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Status</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((v, idx) => {
                const kelasNama = v.siswa?.kelas_id
                  ? kelasList.find((k) => k.id === v.siswa!.kelas_id)?.nama ||
                    "N/A"
                  : "N/A";
                return (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="p-2">{v.siswa?.nama}</td>
                    <td className="p-2 text-center">{v.siswa?.nis || "N/A"}</td>
                    <td className="p-2 text-center">{kelasNama}</td>
                    <td className="p-2">{v.jenis_pelanggaran}</td>
                    <td className="p-2">
                      <Badge className={getSeverityColor(v.tingkat)}>
                        {v.tingkat}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{v.poin}</td>
                    <td className="p-2 text-center">
                      {new Date(v.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(v.status)}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/pelanggaran/${v.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(v)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(v.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Dialog
          open={deleteId !== null}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <ConfirmDeleteDialog
            onConfirm={() => {
              if (deleteId !== null) {
                onDelete(deleteId);
                setDeleteId(null);
              }
            }}
          />
        </Dialog>
      </div>

      {/* Pagination */}
      {violations.length > 0 && (
        <div className="flex justify-between text-xs text-gray-600 items-center">
          <div>
            Menampilkan {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, violations.length)} dari{" "}
            {violations.length} data
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span>
              Halaman {page} dari {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
