'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmDeleteDialog from "@/components/Layout/DeleteDialog";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface Violation {
  id: number;
  studentName: string;
  studentId: string;
  class: string;
  violationType: string;
  severity: string;
  points: number;
  date: string;
  description: string;
  status: string;
}

interface PelanggaranTableProps {
  violations: Violation[];
  onEdit: (violation: Violation) => void;
  onDelete: (id: number) => void;
  pageSize: number;
}

const PelanggaranTable = ({ violations, onEdit, onDelete }: PelanggaranTableProps) => {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filteredViolations = useMemo(() => {
    if (!search) return violations;
    const q = search.toLowerCase();
    return violations.filter(v =>
      v.studentName.toLowerCase().includes(q) ||
      v.studentId.toLowerCase().includes(q) ||
      v.class.toLowerCase().includes(q) ||
      v.violationType.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q) ||
      v.severity.toLowerCase().includes(q)
    );
  }, [violations, search]);

  const totalPages = Math.ceil(filteredViolations.length / pageSize);
  const paginatedData = filteredViolations.slice((page - 1) * pageSize, page * pageSize);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Ringan": return "bg-green-100 text-green-800";
      case "Sedang": return "bg-yellow-100 text-yellow-800";
      case "Berat": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif": return "bg-orange-100 text-orange-800";
      case "Selesai": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Table */}
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
            {paginatedData.length > 0 ? paginatedData.map((v, idx) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-center">{(page - 1) * pageSize + idx + 1}</td>
                <td className="p-2">{v.studentName}</td>
                <td className="p-2 text-center">{v.studentId}</td>
                <td className="p-2 text-center">{v.class}</td>
                <td className="p-2">{v.violationType}</td>
                <td className="p-2">
                  <Badge className={getSeverityColor(v.severity)}>{v.severity}</Badge>
                </td>
                <td className="p-2 text-center">{v.points}</td>
                <td className="p-2 text-center">{v.date}</td>
                <td className="p-2">
                  <Badge className={getStatusColor(v.status)}>{v.status}</Badge>
                </td>
                <td className="p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5" /></Button>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <ConfirmDeleteDialog onConfirm={() => onDelete(v.id)} />
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={10} className="p-4 text-center text-gray-500">Tidak ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div>Halaman {page} dari {totalPages}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PelanggaranTable;
