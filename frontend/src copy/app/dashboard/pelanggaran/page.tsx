"use client";

import { useState, useMemo } from "react";
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

const dummyViolations: Violation[] = [
  {
    id: 1,
    studentName: "Ahmad Fauzi",
    studentId: "12345",
    class: "XII-A",
    violationType: "Berkelahi",
    severity: "Berat",
    points: 25,
    date: "2025-01-15",
    description: "Perkelahian di kantin",
    status: "Aktif",
  },
  {
    id: 2,
    studentName: "Siti Nurhaliza",
    studentId: "12346",
    class: "XI-B",
    violationType: "Seragam",
    severity: "Sedang",
    points: 10,
    date: "2025-01-14",
    description: "Tidak memakai seragam",
    status: "Selesai",
  },
  {
    id: 3,
    studentName: "Budi Santoso",
    studentId: "12347",
    class: "X-A",
    violationType: "Terlambat",
    severity: "Ringan",
    points: 5,
    date: "2025-01-13",
    description: "Terlambat masuk sekolah",
    status: "Aktif",
  },
  {
    id: 4,
    studentName: "Rina Dewi",
    studentId: "12348",
    class: "XII-B",
    violationType: "Merokok",
    severity: "Berat",
    points: 30,
    date: "2025-01-12",
    description: "Merokok di toilet sekolah",
    status: "Selesai",
  },
  {
    id: 5,
    studentName: "Joko Widodo",
    studentId: "12349",
    class: "XI-A",
    violationType: "Bolos",
    severity: "Sedang",
    points: 15,
    date: "2025-01-11",
    description: "Bolos pada jam pelajaran",
    status: "Aktif",
  },
];

export default function PelanggaranPage() {
  const [violations, setViolations] = useState<Violation[]>(dummyViolations);
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

  const filterOptions = useMemo(() => {
    const types = [...new Set(violations.map((v) => v.violationType))];
    const severities = ["Ringan", "Sedang", "Berat"];
    const statuses = ["Aktif", "Selesai"];
    return { types, severities, statuses };
  }, [violations]);

  const filteredViolations = useMemo(() => {
    return violations.filter((violation) => {
      if (
        filters.startDate &&
        new Date(violation.date) < new Date(filters.startDate)
      )
        return false;
      if (
        filters.endDate &&
        new Date(violation.date) > new Date(filters.endDate)
      )
        return false;
      if (filters.status && violation.status !== filters.status) return false;
      if (filters.severity && violation.severity !== filters.severity)
        return false;
      if (
        filters.violationType &&
        violation.violationType !== filters.violationType
      )
        return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          violation.studentName.toLowerCase().includes(q) ||
          violation.studentId.toLowerCase().includes(q) ||
          violation.class.toLowerCase().includes(q) ||
          violation.violationType.toLowerCase().includes(q) ||
          violation.description.toLowerCase().includes(q) ||
          violation.status.toLowerCase().includes(q) ||
          violation.severity.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [violations, filters, search]);

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
  const handleAdd = (newViolation: Omit<Violation, "id">) => {
    const newId = Math.max(0, ...violations.map((v) => v.id)) + 1;
    setViolations((prev) => [...prev, { id: newId, ...newViolation }]);
  };
  const handleEdit = (violation: Violation) => {
    setEditingViolation(violation);
    setEditDialogOpen(true);
  };
  const handleUpdate = (updatedViolation: Violation) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === updatedViolation.id ? updatedViolation : v))
    );
    setEditDialogOpen(false);
    setEditingViolation(null);
  };
  const handleDelete = (id: number) =>
    setViolations((prev) => prev.filter((v) => v.id !== id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
      <ExportTabel data={filteredViolations} />

      <Card className="p-4 shadow">
        <div className="space-y-4">
          {/* Header bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 text-sm w-full sm:w-[300px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
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
              <div className="text-xs text-gray-600 ml-2">
                <span className="font-medium text-blue-600">
                  {filteredViolations.length}
                </span>{" "}
                dari {violations.length} data
              </div>
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-20 h-9 text-sm">
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
            />
          </div>

          {/* Filter detail section */}
          {showFilters && (
            <PelanggaranFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              search={search}
              setSearch={setSearch}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              filterOptions={filterOptions}
              filteredCount={filteredViolations.length}
              totalCount={violations.length}
            />
          )}

          {/* Table */}
          <PelanggaranTable
            violations={filteredViolations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={pageSize}
          />
        </div>
      </Card>

      {/* Edit Dialog */}
      <EditPelanggaranDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        violation={editingViolation}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
