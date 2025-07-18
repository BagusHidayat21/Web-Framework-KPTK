"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import PelanggaranTable, {
  type Violation,
} from "@/components/Pelanggaran/PelanggaranTable";
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

interface Student {
  id: number;
  nama: string;
  nis: string;
  kelas_id: number;
  kelas_nama: string;
}

interface Kelas {
  id: number;
  nama: string;
  tingkat: string;
}

export default function PelanggaranPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Violation | null>(
    null
  );
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchViolations(), fetchStudents(), fetchKelas()]);
    } catch (error) {
      setError("Gagal memuat data awal");
    } finally {
      setLoading(false);
    }
  };

  const fetchViolations = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/pelanggaran", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setViolations(res.data.data || []);
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/siswa", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data.data || []);
  };

  const fetchKelas = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/kelas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKelas(res.data.data || []);
  };

  const handleAdd = async (newViolation: Omit<Violation, "id">) => {
    const token = localStorage.getItem("token");
    const res = await api.post("/pelanggaran", newViolation, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setViolations((prev) => [...prev, res.data.data]);
    setAddDialogOpen(false);
  };

  const handleUpdate = async (updated: Violation & { updated_by: number }) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        jenis_pelanggaran: updated.jenis_pelanggaran,
        tingkat: updated.tingkat,
        poin: updated.poin,
        tanggal: updated.tanggal,
        deskripsi: updated.deskripsi,
        status: updated.status,
        updated_by: updated.updated_by
      };
      const res = await api.put(`/pelanggaran/${updated.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newData = res.data.data;
      setViolations(prev => prev.map(v =>
        v.id === newData.id
          ? { ...newData, siswa: v.siswa }
          : v
      ));
      setEditDialogOpen(false);
      setEditingViolation(null);
    } catch (e) {
      console.error(e);
    }
  };
  

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    await api.delete(`/pelanggaran/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setViolations((prev) => prev.filter((v) => v.id !== id));
  };

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

  const filterOptions = useMemo(() => {
    const types = [...new Set(violations.map((v) => v.jenis_pelanggaran))];
    const severities = ["Ringan", "Sedang", "Berat"];
    const statuses = ["Aktif", "Selesai"];
    return { types, severities, statuses };
  }, [violations]);

  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      if (
        filters.startDate &&
        new Date(v.tanggal) < new Date(filters.startDate)
      )
        return false;
      if (filters.endDate && new Date(v.tanggal) > new Date(filters.endDate))
        return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.severity && v.tingkat !== filters.severity) return false;
      if (
        filters.violationType &&
        v.jenis_pelanggaran !== filters.violationType
      )
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

  // Reset page ke 1 kalau filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [filters, search, pageSize]);

  if (loading)
    return <div className="flex justify-center h-64">Memuat data...</div>;
  if (error)
    return <div className="flex justify-center h-64 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
        <ExportTabel data={filteredViolations} kelas={kelas} />
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
            {(showFilters ||
              search ||
              Object.values(filters).some((v) => v)) && (
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
            <AddPelanggaranDialog
              open={addDialogOpen}
              onOpenChange={setAddDialogOpen}
              onAdd={handleAdd}
              students={students}
              kelas={kelas}
            />
          </div>
        </div>

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

      <EditPelanggaranDialog
        open={!!editingViolation}
        onOpenChange={(o) => !o && setEditingViolation(null)}
        violation={editingViolation}
        onUpdate={handleUpdate}
      />
    </div>
  );
}