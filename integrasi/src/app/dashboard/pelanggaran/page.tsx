"use client";

import { useState, useEffect, useMemo } from "react";
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
import { api } from "@/lib/api";
import { Kelas, Siswa, Pelanggaran } from "@/types";

export default function PelanggaranPage() {
  // === STATE ===
  const [students, setStudents] = useState<Siswa[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [violations, setViolations] = useState<Pelanggaran[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Pelanggaran | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    severity: "",
    violationType: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === FETCH DATA AWAL ===
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchViolations(),
          fetchStudents(),
          fetchKelas(),
        ]);
      } catch {
        setError("Gagal memuat data awal");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- API calls ---
  const fetchViolations = async () => {
    const res = await api.get("/pelanggaran");
    setViolations(res.data.data || []);
  };

  const fetchStudents = async () => {
    const res = await api.get("/siswa");
    setStudents(res.data.data || []);
  };

  const fetchKelas = async () => {
    const res = await api.get("/kelas");
    setKelas(res.data.data || []);
  };

  // === CRUD HANDLERS ===
  const handleAdd = async (newViolation: Omit<Pelanggaran, "id">) => {
    const res = await api.post("/pelanggaran", newViolation);
    setViolations((prev) => [...prev, res.data.data]);
    setAddDialogOpen(false);
  };

  const handleUpdate = async (updated: Pelanggaran & { updated_by: number }) => {
    try {
      // payload untuk API
      const payload = {
        jenis_pelanggaran: updated.jenis_pelanggaran,
        tingkat: updated.tingkat,
        poin: updated.poin,
        tanggal: updated.tanggal,
        deskripsi: updated.deskripsi,
        status: updated.status,
        updated_by: updated.updated_by,
      };

      const res = await api.put(`/pelanggaran/${updated.id}`, payload);
      const newData = res.data.data;

      // update state lokal
      setViolations((prev) =>
        prev.map((v) =>
          v.id === newData.id ? { ...newData, siswa: v.siswa } : v
        )
      );

      setEditingViolation(null);
    } catch (e) {
      console.error("Gagal update pelanggaran:", e);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/pelanggaran/${id}`);
    setViolations((prev) => prev.filter((v) => v.id !== id));
  };

  // === FILTER & SEARCH ===
  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      severity: "",
      violationType: "",
    });
    setSearch("");
  };

  // Opsi filter yang tersedia
  const filterOptions = useMemo(() => {
    const types = [...new Set(violations.map((v) => v.jenis_pelanggaran))];
    const severities = ["Ringan", "Sedang", "Berat"];
    const statuses = ["Aktif", "Selesai"];
    return { types, severities, statuses };
  }, [violations]);

  // Hasil setelah filter & search
  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      if (filters.startDate && new Date(v.tanggal) < new Date(filters.startDate))
        return false;
      if (filters.endDate && new Date(v.tanggal) > new Date(filters.endDate))
        return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.severity && v.tingkat !== filters.severity) return false;
      if (filters.violationType && v.jenis_pelanggaran !== filters.violationType)
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.siswa?.nama?.toLowerCase().includes(q) ||
          v.siswa?.nis?.toLowerCase().includes(q) ||
          v.jenis_pelanggaran?.toLowerCase().includes(q) ||
          v.deskripsi?.toLowerCase().includes(q) ||
          v.status?.toLowerCase().includes(q) ||
          v.tingkat?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [violations, filters, search]);

  // Reset halaman ke 1 setiap kali filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [filters, search, pageSize]);

  // === RENDER ===
  if (loading)
    return <div className="flex justify-center h-64">Memuat data...</div>;
  if (error)
    return <div className="flex justify-center h-64 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Header + Export */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
        <ExportTabel data={filteredViolations} kelas={kelas} />
      </div>

      <Card className="p-4">
        {/* Search + Filter + Reset + Page Size + Tambah */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex flex-1 gap-2">
            {/* 🔍 Search */}
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* 🔽 Toggle filter */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
            {/* ❌ Reset */}
            {(showFilters || search || Object.values(filters).some((v) => v)) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {/* 🔢 Jumlah data per halaman */}
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Jumlah" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* ➕ Tambah data */}
            <AddPelanggaranDialog
              open={addDialogOpen}
              onOpenChange={setAddDialogOpen}
              onAdd={handleAdd}
              students={students}
              kelas={kelas}
            />
          </div>
        </div>

        {/* Filter detail */}
        {showFilters && (
          <PelanggaranFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            search={search}
            setSearch={setSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            onClearFilters={clearFilters}
            filteredCount={filteredViolations.length}
            totalCount={violations.length}
          />
        )}

        {/* Tabel utama */}
        <PelanggaranTable
          violations={filteredViolations}
          kelasList={kelas}
          onEdit={setEditingViolation}
          onDelete={handleDelete}
          pageSize={pageSize}
          page={page}
          setPage={setPage}
        />
      </Card>

      {/* Dialog edit */}
      <EditPelanggaranDialog
        open={!!editingViolation}
        onOpenChange={(o) => !o && setEditingViolation(null)}
        violation={editingViolation}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
