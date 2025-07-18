"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InfoSiswa from "@/components/Pelanggaran/Detail/InfoSiswa";
import BuktiPelanggaran from "@/components/Pelanggaran/Detail/BuktiPelanggaran";
import TindakanDiambil from "@/components/Pelanggaran/Detail/TindakanDiambil";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

import { api } from "@/lib/api";

interface Student {
  id: number;
  nama: string;
  nis: string;
  kelas_id: number;
}

interface Reporter {
  id: number;
  name: string;
}

interface EvidenceItem {
  id: number;
  tipe: "image" | "document";
  url: string;
  nama?: string;
  deskripsi?: string;
  diunggah_oleh: string;
  waktu_unggah: string;
}

interface ViolationDetail {
  id: number;
  siswa: Student;
  pelapor: Reporter | null;
  jenis_pelanggaran: string;
  tingkat: string;
  poin: number;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  tindakan?: string;
  tanggal_tindak_lanjut?: string;
  catatan?: string;
  bukti: EvidenceItem[];
}

export default function DetailPelanggaranPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [violation, setViolation] = useState<ViolationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    action: "",
    note: "",
    followUp: "",
  });

  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/pelanggaran/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setViolation(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Gagal fetch detail pelanggaran:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Ringan":
        return "bg-green-100 text-green-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Berat":
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

  const handleInputChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleActionSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/pelanggaran/${id}`,
        {
          tindakan: formData.action,
          catatan: formData.note,
          tanggal_tindak_lanjut: formData.followUp,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setViolation((prev) =>
        prev
          ? {
              ...prev,
              tindakan: formData.action,
              catatan: formData.note,
              tanggal_tindak_lanjut: formData.followUp,
            }
          : null
      );
    } catch (error) {
      console.error("Gagal update tindakan:", error);
    } finally {
      setIsEditModalOpen(false);
      setFormData({ action: "", note: "", followUp: "" });
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await api.patch(
        `/pelanggaran/${id}`,
        {
          status: "Selesai",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setViolation((prev) => (prev ? { ...prev, status: "Selesai" } : null));
      alert("Berhasil update status pelanggaran!");
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const handleDownloadReport = async () => {
    if (!violation) return;
  
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Pelanggaran Siswa", 14, 20);
  
    autoTable(doc, {
      startY: 30,
      head: [["Kolom", "Detail"]],
      body: [
        ["Nama Siswa", violation.siswa.nama],
        ["NIS", violation.siswa.nis],
        ["Kelas ID", violation.siswa.kelas_id.toString()],
        ["Jenis Pelanggaran", violation.jenis_pelanggaran],
        ["Tingkat", violation.tingkat],
        ["Poin", violation.poin.toString()],
        ["Tanggal & Waktu", `${violation.tanggal} | ${violation.waktu}`],
        ["Lokasi", violation.lokasi],
        ["Dilaporkan oleh", violation.pelapor?.name || "-"],
        ["Deskripsi", violation.deskripsi],
        ["Status", violation.status],
      ],
      styles: { fontSize: 10 },
    });
  
    // Tambahkan jarak tetap di bawah tabel
    let nextY = 90 + (violation.bukti.length ? violation.bukti.length * 40 : 60);
  
    doc.setFontSize(12);
    doc.text("Bukti Pelanggaran:", 14, nextY);
    nextY += 1;
  
    for (const b of violation.bukti) {
      if (b.tipe === "image") {
        try {
          const res = await api.get(`/bukti/image/${b.id}`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const blob = res.data as Blob;
  
          const dataUrl: string = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
  
          doc.addImage(dataUrl, "JPEG", 14, nextY, 40, 30);
          nextY += 35;
        } catch (err) {
          console.error("Gagal load image:", err);
          doc.setFontSize(10);
          doc.text(`(Gagal memuat gambar: ${b.nama || "-"})`, 14, nextY);
          nextY += 5;
        }
      } else {
        doc.setFontSize(10);
        doc.text(`File: ${b.nama || "-"} (${b.deskripsi || "-"})`, 14, nextY);
        nextY += 1;
      }
    }
  
    nextY += 1;
    doc.setFontSize(12);
    doc.text("Tindakan:", 14, nextY);
    nextY += 6;
  
    doc.setFontSize(10);
    doc.text(`Sanksi / Tindakan: ${violation.tindakan || "-"}`, 14, nextY);
    nextY += 6;
    doc.text(`Tanggal Tindak Lanjut: ${violation.tanggal_tindak_lanjut || "-"}`, 14, nextY);
    nextY += 6;
    doc.text("Catatan:", 14, nextY);
    nextY += 6;
    doc.text(violation.catatan || "-", 14, nextY, { maxWidth: 180 });
  
    doc.save(`pelanggaran_${violation.siswa.nis}.pdf`);
  };
  

  if (loading) return <div className="p-4">Loading...</div>;
  if (!violation) return <div className="p-4">Data tidak ditemukan.</div>;
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <InfoSiswa
          data={{
            studentName: violation.siswa.nama,
            studentId: violation.siswa.nis,
            class: `ID ${violation.siswa.kelas_id}`,
            violationType: violation.jenis_pelanggaran,
            severity: violation.tingkat,
            points: violation.poin,
            date: violation.tanggal,
            time: violation.waktu,
            location: violation.lokasi,
            description: violation.deskripsi,
            reportedBy: violation.pelapor?.name || "-",
            status: violation.status,
          }}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />

        <BuktiPelanggaran
          bukti={violation.bukti}
          onLihat={setSelectedEvidence}
        />

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

        <Button
          onClick={handleDownloadReport}
          className="bg-blue-600 text-white w-full"
        >
          <Download className="w-4 mr-2" /> Download Laporan (PDF)
        </Button>

        <Button
          onClick={handleMarkAsDone}
          className="bg-green-600 text-white w-full"
        >
          <Check className="w-4 mr-2" /> Tandai Selesai
        </Button>
      </div>

      {/* Modal bukti */}
      <Dialog
        open={!!selectedEvidence}
        onOpenChange={() => setSelectedEvidence(null)}
      >
        {selectedEvidence && (
          <DialogContent className="max-w-3xl">
            <VisuallyHidden>
              <DialogTitle>Lihat Bukti Pelanggaran</DialogTitle>
            </VisuallyHidden>

            {selectedEvidence.tipe === "image" ? (
              <img
                src={`${apiBaseURL}${selectedEvidence.url}`}
                alt={selectedEvidence.deskripsi || "Bukti"}
                className="max-h-[80vh] mx-auto rounded"
              />
            ) : (
              <iframe
                src={`${apiBaseURL}${selectedEvidence.url}`}
                className="w-full h-[80vh]"
                title={selectedEvidence.nama}
              />
            )}
            <p className="mt-2 text-center text-sm text-gray-600">
              {selectedEvidence.deskripsi || selectedEvidence.nama}
            </p>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
