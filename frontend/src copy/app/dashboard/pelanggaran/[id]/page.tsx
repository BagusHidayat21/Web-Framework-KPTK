"use client";

import { useState } from "react";
import InfoSiswa from "@/components/Pelanggaran/Detail/InfoSiswa";
import BuktiPelanggaran from "@/components/Pelanggaran/Detail/BuktiPelanggaran";
import TindakanDiambil from "@/components/Pelanggaran/Detail/TindakanDiambil";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

// Halaman detail pelanggaran
export default function DetailPelanggaranPage() {
  // Data contoh (nanti bisa di-fetch dari API)
  const violation = {
    id: 1,
    studentName: "Ahmad Fauzi",
    studentId: "12345",
    class: "XII-A",
    violationType: "Berkelahi",
    severity: "Berat",
    points: 25,
    date: "2025-01-15",
    time: "10:30",
    location: "Kantin Sekolah",
    reportedBy: "Ibu Sari (Guru Piket)",
    description:
      "Siswa terlibat perkelahian dengan siswa lain bernama Budi Santoso di area kantin pada jam istirahat. Perkelahian dipicu oleh masalah sepele namun berkembang menjadi perkelahian fisik yang cukup serius.",
    status: "Aktif",
    evidence: [
      {
        id: 1,
        type: "image",
        url: "https://via.placeholder.com/400x300/e3f2fd/1976d2?text=Foto+Bukti+1",
        description: "Foto kondisi kantin setelah kejadian",
        uploadedBy: "Satpam Sekolah",
        uploadedAt: "2025-01-15 10:35",
      },
      {
        id: 2,
        type: "image",
        url: "https://via.placeholder.com/400x300/fff3e0/f57c00?text=Foto+Bukti+2",
        description: "Foto siswa yang terlibat",
        uploadedBy: "Guru Piket",
        uploadedAt: "2025-01-15 10:40",
      },
      {
        id: 3,
        type: "document",
        url: "#",
        name: "Laporan_Saksi.pdf",
        description: "Keterangan saksi kejadian",
        uploadedBy: "Wakil Kepala Sekolah",
        uploadedAt: "2025-01-15 11:00",
      },
    ],
    actionTaken: "Pemanggilan orang tua, skorsing 3 hari",
    followUpDate: "2025-01-18",
    notes: "Siswa menunjukkan penyesalan dan berjanji tidak akan mengulangi. Perlu pengawasan khusus.",
  };

  // State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    action: "",
    note: "",
    followUp: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Fungsi helper warna badge
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

  // Event handler
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleActionSubmit = () => {
    console.log("Data tindakan disimpan:", formData);
    setIsEditModalOpen(false);
    setFormData({ action: "", note: "", followUp: "" });
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Pelanggaran Siswa", 14, 20);

    // Bagian 1: Data detail
    autoTable(doc, {
      startY: 30,
      head: [["Kolom", "Detail"]],
      body: [
        ["Nama Siswa", violation.studentName],
        ["NIS", violation.studentId],
        ["Kelas", violation.class],
        ["Jenis Pelanggaran", violation.violationType],
        ["Tingkat", violation.severity],
        ["Poin", violation.points.toString()],
        ["Tanggal & Waktu", `${violation.date} | ${violation.time}`],
        ["Lokasi", violation.location],
        ["Status", violation.status],
        ["Dilaporkan oleh", violation.reportedBy],
        ["Deskripsi Kejadian", violation.description],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: "bold" } },
    });

    // Bagian 2: Bukti
    const evidenceRows: RowInput[] = violation.evidence.map((e) => [
      e.type === "image" ? "Gambar" : "Dokumen",
      e.description || e.name || "",
      e.uploadedBy || "",
      e.uploadedAt || "",
    ]);
    if (evidenceRows.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Tipe", "Nama/Deskripsi", "Diunggah Oleh", "Waktu"]],
        body: evidenceRows,
        styles: { fontSize: 9 },
      });
    }

    // Bagian 3: Tindakan
    doc.setFontSize(12);
    doc.text("Tindakan yang Diambil:", 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(10);
    doc.text(`Sanksi / Tindakan: ${violation.actionTaken}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Tanggal Tindak Lanjut: ${violation.followUpDate}`, 14, doc.lastAutoTable.finalY + 28);
    doc.text("Catatan:", 14, doc.lastAutoTable.finalY + 34);
    doc.text(violation.notes, 14, doc.lastAutoTable.finalY + 40, { maxWidth: 180 });

    doc.save(`laporan_pelanggaran_${violation.studentId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <InfoSiswa
          data={violation}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />
        <BuktiPelanggaran
          bukti={violation.evidence}
          onLihat={(image) => setSelectedImage(image)}
        />
        <TindakanDiambil
          actionTaken={violation.actionTaken}
          followUpDate={violation.followUpDate}
          notes={violation.notes}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleActionSubmit={handleActionSubmit}
        />
        <Button
          onClick={handleDownloadReport}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-full"
        >
          <Download className="w-4 mr-2" /> Download Laporan (PDF)
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white min-w-full"
        >
          <Check className="w-4 mr-2" /> Pelanggaran Selesai
        </Button>
      </div>
    </div>
  );
}
