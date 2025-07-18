'use client';

import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Violation } from './PelanggaranTable'; // sesuaikan path kalau beda

interface Kelas {
  id: number;
  nama: string;
  tingkat: string;
}

interface ExportButtonsProps {
  data: Violation[];
  kelas: Kelas[];
}

export default function ExportTabel({ data, kelas }: ExportButtonsProps) {

  const exportViolationsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((v) => {
        // Cari nama kelas dari master kelas
        const kelasNama = v.siswa?.kelas?.nama
          || kelas.find(k => k.id === v.siswa?.kelas_id)?.nama
          || '';

        return {
          ID: v.id,
          "Nama Siswa": v.siswa?.nama || '',
          NIS: v.siswa?.nis || '',
          Kelas: kelasNama,
          "Jenis Pelanggaran": v.jenis_pelanggaran || '',
          Tingkat: v.tingkat || '',
          Poin: v.poin || 0,
          Tanggal: v.tanggal || '',
          Deskripsi: v.deskripsi || '',
          Status: v.status || '',
        };
      })
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
      body: data.map((v) => {
        const kelasNama = v.siswa?.kelas?.nama
          || kelas.find(k => k.id === v.siswa?.kelas_id)?.nama
          || '';

        return [
          v.id,
          v.siswa?.nama || '',
          v.siswa?.nis || '',
          kelasNama,
          v.jenis_pelanggaran || '',
          v.tingkat || '',
          v.poin || 0,
          v.tanggal || '',
          v.deskripsi || '',
          v.status || '',
        ];
      }),
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
