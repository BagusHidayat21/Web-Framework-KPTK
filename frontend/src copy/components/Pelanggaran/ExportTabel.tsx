'use client';

import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Violation } from './PelanggaranTable'; // sesuaikan path kalau beda

interface ExportButtonsProps {
  data: Violation[];
}

export default function ExportTabel({ data }: ExportButtonsProps) {

  const exportViolationsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((v) => ({
        ID: v.id,
        "Nama Siswa": v.studentName,
        NIS: v.studentId,
        Kelas: v.class,
        "Jenis Pelanggaran": v.violationType,
        Tingkat: v.severity,
        Poin: v.points,
        Tanggal: v.date,
        Deskripsi: v.description,
        Status: v.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pelanggaran");
    XLSX.writeFile(workbook, `pelanggaran_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const exportViolationsToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Pelanggaran", 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [[
        "ID", "Nama Siswa", "NIS", "Kelas", "Jenis Pelanggaran",
        "Tingkat", "Poin", "Tanggal", "Deskripsi", "Status"
      ]],
      body: data.map((v) => [
        v.id, v.studentName, v.studentId, v.class, v.violationType,
        v.severity, v.points, v.date, v.description, v.status
      ]),
      styles: { fontSize: 7 },
    });

    doc.save(`pelanggaran_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportViolationsToExcel}
        className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
      >
        Export as Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportViolationsToPDF}
        className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
      >
        Download PDF
      </Button>
    </div>
  );
}
