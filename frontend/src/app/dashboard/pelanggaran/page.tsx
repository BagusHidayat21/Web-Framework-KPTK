"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import PelanggaranTable from "@/components/Pelanggaran/PelanggaranTable";
import AddPelanggaranDialog from "@/components/Pelanggaran/AddPelanggaranDialog";
import EditPelanggaranDialog from "@/components/Pelanggaran/EditPelanggaranDialog";
import PelanggaranFilters from "@/components/Pelanggaran/FilterTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportTabel from "@/components/Pelanggaran/ExportTabel";
import type { Pelanggaran } from "@/types";

const dummyViolations: Pelanggaran[] = [
  {
    id: 1,
    siswa_id: 101,
    dilaporkan_oleh_id: 201,
    jenis_pelanggaran: "Berkelahi",
    tingkat: "Berat",
    poin: "5",
    tanggal: "2025-01-15",
    waktu: "07:10",
    lokasi: "Gerbang",
    deskripsi: "Siswa berkelahi",
    status: "Aktif",
    tindakan: "",
    tanggal_tindak_lanjut: "",
    catatan: "",
    created_at: "2025-01-15",
    updated_at: "2025-01-15",
    siswa: {
      id: 101,
      nis: "12345",
      nama: "Ahmad Fauzi",
      kelas_id: 1,
      jenis_kelamin: "Laki-laki",
      tanggal_lahir: "2007-05-01",
      alamat: "Jl. Merdeka No.1",
      kelas: {
        id: 1,
        kelas: "XII-A",
      }
    },
    dilaporkan_oleh: {
      id: 201,
      name: "Petugas BK",
      email: "bk@example.com",
      email_verified_at: "",
      password: "",
      created_at: "",
      updated_at: ""
    }
  },
];

export default function PelanggaranPage() {
  const [violations, setViolations] = useState<Pelanggaran[]>(dummyViolations);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Pelanggaran | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    severity: "",           // pakai `tingkat`
    violationType: "",      // pakai `jenis_pelanggaran`
  });
  const [pageSize, setPageSize] = useState(10);

  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      if (filters.startDate && new Date(v.tanggal) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(v.tanggal) > new Date(filters.endDate)) return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.severity && v.tingkat !== filters.severity) return false;
      if (filters.violationType && v.jenis_pelanggaran !== filters.violationType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.siswa.nama.toLowerCase().includes(q) ||
          v.siswa.nis.toLowerCase().includes(q) ||
          v.siswa.kelas.kelas.toLowerCase().includes(q) ||
          v.jenis_pelanggaran.toLowerCase().includes(q) ||
          v.deskripsi.toLowerCase().includes(q) ||
          v.status.toLowerCase().includes(q) ||
          v.tingkat.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [violations, filters, search]);

  const handleAdd = (newV: Omit<Pelanggaran, "id">) => {
    const newId = Math.max(0, ...violations.map(v => v.id)) + 1;
    setViolations(prev => [...prev, { id: newId, ...newV }]);
  };
  const handleEdit = (v: Pelanggaran) => {
    setEditingViolation(v);
    setEditDialogOpen(true);
  };
  const handleUpdate = (updated: Pelanggaran) => {
    setViolations(prev => prev.map(v => v.id === updated.id ? updated : v));
    setEditDialogOpen(false);
    setEditingViolation(null);
  };
  const handleDelete = (id: number) =>
    setViolations(prev => prev.filter(v => v.id !== id));
  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "", status: "", severity: "", violationType: "" });
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
      <ExportTabel data={filteredViolations} />

      <Card className="p-4 shadow">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 text-sm w-full sm:w-[300px]"
              />
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" /> Filter
              </Button>
              {showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-20 h-9 text-sm">
                <SelectValue placeholder="Jumlah" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddPelanggaranDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAdd} />
          </div>

          {showFilters && (
            <PelanggaranFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              search={search}
              setSearch={setSearch}
              filters={filters}
              onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
              onClearFilters={clearFilters}
              filterOptions={{
                types: [...new Set(violations.map(v => v.jenis_pelanggaran))],
                severities: ["Ringan", "Sedang", "Berat"],
                statuses: ["Aktif", "Selesai"],
              }}
              filteredCount={filteredViolations.length}
              totalCount={violations.length}
            />
          )}

          <PelanggaranTable
            violations={filteredViolations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={pageSize}
          />
        </div>
      </Card>

      <EditPelanggaranDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        violation={editingViolation}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
