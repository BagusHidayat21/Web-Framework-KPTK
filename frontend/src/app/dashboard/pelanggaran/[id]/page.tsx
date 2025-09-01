"use client";

import { useState } from "react";
import InfoSiswa from "@/components/Pelanggaran/Detail/InfoSiswa";
import BuktiPelanggaran from "@/components/Pelanggaran/Detail/BuktiPelanggaran";
import TindakanDiambil from "@/components/Pelanggaran/Detail/TindakanDiambil";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Pelanggaran, EvidenceItem } from "@/types";

export default function DetailPelanggaranPage() {
  const violation: Pelanggaran = {
    id: 1,
    siswa_id: 101,
    dilaporkan_oleh_id: 201,
    jenis_pelanggaran: "Berkelahi",
    tingkat: "Berat",
    poin: "25",
    tanggal: "2025-01-15",
    waktu: "10:30",
    lokasi: "Kantin Sekolah",
    deskripsi: "Siswa terlibat perkelahian dengan siswa lain bernama Budi Santoso...",
    status: "Aktif",
    tindakan: "Pemanggilan orang tua, skorsing 3 hari",
    tanggal_tindak_lanjut: "2025-01-18",
    catatan: "Siswa menunjukkan penyesalan...",
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
      name: "Ibu Sari (Guru Piket)",
      email: "ibu.sari@example.com",
      password: "",
      created_at: "",
      updated_at: ""
    }
  };

  const evidence: EvidenceItem[] = [
    {
      id: 1,
      pelanggaran_id: violation.id,
      tipe: "image",
      url: "https://via.placeholder.com/400x300/e3f2fd/1976d2?text=Foto+Bukti+1",
      deskripsi: "Foto kondisi kantin setelah kejadian",
      nama: "",
      diunggah_oleh: "Satpam Sekolah",
      waktu_unggah: "2025-01-15 10:35",
      pelanggaran: violation
    },
    {
      id: 2,
      pelanggaran_id: violation.id,
      tipe: "image",
      url: "https://via.placeholder.com/400x300/fff3e0/f57c00?text=Foto+Bukti+2",
      deskripsi: "Foto siswa yang terlibat",
      nama: "",
      diunggah_oleh: "Guru Piket",
      waktu_unggah: "2025-01-15 10:40",
      pelanggaran: violation
    },
    {
      id: 3,
      pelanggaran_id: violation.id,
      tipe: "document",
      url: "#",
      deskripsi: "Keterangan saksi kejadian",
      nama: "Laporan_Saksi.pdf",
      diunggah_oleh: "Wakil Kepala Sekolah",
      waktu_unggah: "2025-01-15 11:00",
      pelanggaran: violation
    }
  ];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ action: "", note: "", followUp: "" });
  const [selectedImage, setSelectedImage] = useState<null | string>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "ringan": return "bg-green-100 text-green-800";
      case "sedang": return "bg-yellow-100 text-yellow-800";
      case "berat": return "bg-red-100 text-red-800";
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

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleActionSubmit = () => {
    console.log("Data tindakan disimpan:", formData);
    setIsEditModalOpen(false);
    setFormData({ action: "", note: "", followUp: "" });
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Pelanggaran Siswa", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Kolom", "Detail"]],
      body: [
        ["Nama Siswa", violation.siswa.nama],
        ["NIS", violation.siswa.nis],
        ["Kelas", violation.siswa.kelas.kelas],
        ["Jenis Pelanggaran", violation.jenis_pelanggaran],
        ["Tingkat", violation.tingkat],
        ["Poin", violation.poin],
        ["Tanggal & Waktu", `${violation.tanggal} | ${violation.waktu}`],
        ["Lokasi", violation.lokasi],
        ["Status", violation.status],
        ["Dilaporkan oleh", violation.dilaporkan_oleh.name],
        ["Deskripsi Kejadian", violation.deskripsi]
      ],
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold" } }
    });

    let nextY = (doc as any).lastAutoTable?.finalY + 10 || 100;
    doc.setFontSize(12);
    doc.text("Bukti Pelanggaran:", 14, nextY);
    nextY += 6;

    evidence.forEach(b => {
      doc.setFontSize(10);
      doc.text(
        `• [${b.tipe}] ${b.deskripsi || b.nama || "-"} | Oleh: ${b.diunggah_oleh} | ${b.waktu_unggah}`,
        14,
        nextY,
        { maxWidth: 180 }
      );
      nextY += 6;
    });

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

    doc.save(`laporan_pelanggaran_${violation.siswa.nis}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <InfoSiswa data={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
        <BuktiPelanggaran bukti={evidence} onLihat={setSelectedImage} />
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
        <Button onClick={handleDownloadReport} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-full">
          <Download className="w-4 mr-2" /> Download Laporan (PDF)
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white min-w-full">
          <Check className="w-4 mr-2" /> Pelanggaran Selesai
        </Button>
      </div>
    </div>
  );
}
