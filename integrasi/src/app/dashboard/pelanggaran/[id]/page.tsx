"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import InfoSiswa from "@/components/Pelanggaran/Detail/InfoSiswa";
import BuktiPelanggaran from "@/components/Pelanggaran/Detail/BuktiPelanggaran";
import TindakanDiambil from "@/components/Pelanggaran/Detail/TindakanDiambil";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Pelanggaran, EvidenceItem } from "@/types";
import { api } from "@/lib/api";

export default function DetailPelanggaranPage() {
  // ====== STATE MANAGEMENT ======
  const [violation, setViolation] = useState<Pelanggaran | null>(null); // data pelanggaran
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]); // bukti pelanggaran
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // kontrol modal tindakan
  const [formData, setFormData] = useState({
    action: "",
    note: "",
    followUp: "",
  });

  const { id: violationId } = useParams();

  // ====== HELPERS (COLORING) ======
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "ringan":
        return "bg-green-100 text-green-800";
      case "sedang":
        return "bg-yellow-100 text-yellow-800";
      case "berat":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-orange-100 text-orange-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ====== FETCH DATA ======
  const fetchViolation = useCallback(async () => {
    try {
      const res = await api.get(`/pelanggaran/${violationId}`);
      setViolation(res.data.data);
      setEvidence(res.data.data.bukti || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [violationId]);

  useEffect(() => {
    fetchViolation();
  }, [fetchViolation]);

  // ====== HANDLERS ======
  const handleInputChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleActionSubmit = async () => {
    try {
      await api.put(`/pelanggaran/${violationId}`, {
        tindakan: formData.action,
        catatan: formData.note,
        tanggal_tindak_lanjut: formData.followUp,
      });
      await fetchViolation(); // reload data setelah update
      setIsEditModalOpen(false);
      setFormData({ action: "", note: "", followUp: "" });
    } catch (error) {
      console.error("Gagal update tindakan:", error);
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await api.patch(`/pelanggaran/${violationId}`, { status: "Selesai" });
      await fetchViolation(); // reload data setelah update status
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const handleDownloadReport = () => {
    if (!violation) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Pelanggaran Siswa", 14, 20);

    // Tabel detail utama
    autoTable(doc, {
      startY: 30,
      head: [["Kolom", "Detail"]],
      body: [
        ["Nama Siswa", violation.siswa.nama],
        ["NIS", violation.siswa.nis],
        ["Kelas", violation.siswa.kelas?.kelas || "-"],
        ["Jenis Pelanggaran", violation.jenis_pelanggaran],
        ["Tingkat", violation.tingkat],
        ["Poin", violation.poin],
        ["Tanggal & Waktu", `${violation.tanggal} | ${violation.waktu}`],
        ["Lokasi", violation.lokasi],
        ["Status", violation.status],
        ["Dilaporkan oleh", violation.dilaporkan_oleh.name],
        ["Deskripsi Kejadian", violation.deskripsi],
      ],
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold" } },
    });

    // Posisi lanjut setelah tabel
    let nextY = (doc as any).lastAutoTable?.finalY + 10 || 100;

    // Bukti
    doc.setFontSize(12);
    doc.text("Bukti Pelanggaran:", 14, nextY);
    nextY += 6;

    evidence.forEach((b) => {
      doc.setFontSize(10);
      doc.text(
        `• [${b.tipe}] ${b.deskripsi || b.nama || "-"} | Oleh: ${
          b.diunggah_oleh
        } | ${b.waktu_unggah}`,
        14,
        nextY,
        { maxWidth: 180 }
      );
      nextY += 6;
    });

    // Tindakan
    nextY += 4;
    doc.setFontSize(12);
    doc.text("Tindakan yang Diambil:", 14, nextY);
    nextY += 6;

    doc.setFontSize(10);
    doc.text(`Sanksi / Tindakan: ${violation.tindakan}`, 14, nextY);
    nextY += 6;
    doc.text(`Tanggal Tindak Lanjut: ${violation.tanggal_tindak_lanjut}`, 14, nextY);
    nextY += 6;
    doc.text(`Catatan: ${violation.catatan}`, 14, nextY, { maxWidth: 180 });

    // Simpan PDF
    doc.save(`laporan_pelanggaran_${violation.siswa.nis}.pdf`);
  };

  // ====== RENDER ======
  if (!violation) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Info Siswa */}
        <InfoSiswa
          data={violation}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />

        {/* Bukti */}
        <BuktiPelanggaran
          bukti={evidence.map((e) => ({
            ...e,
            tipe: e.tipe === "image" || e.tipe === "document" ? e.tipe : "document",
          }))}
          onLihat={() => null}
        />

        {/* Tindakan */}
        <TindakanDiambil
          actionTaken={violation.tindakan}
          followUpDate={violation.tanggal_tindak_lanjut}
          notes={violation.catatan}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleActionSubmit={handleActionSubmit}
        />

        {/* Tombol Aksi */}
        <Button
          onClick={handleDownloadReport}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-full"
        >
          <Download className="w-4 mr-2" /> Download Laporan (PDF)
        </Button>

        <Button
          onClick={handleMarkAsCompleted}
          className="bg-green-600 hover:bg-green-700 text-white min-w-full"
        >
          <Check className="w-4 mr-2" /> Pelanggaran Selesai
        </Button>
      </div>
    </div>
  );
}
