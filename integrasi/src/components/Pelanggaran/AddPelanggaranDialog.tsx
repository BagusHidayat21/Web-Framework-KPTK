"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, File, Image } from "lucide-react";

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

interface BuktiFile {
  file: File;
  deskripsi: string;
  preview?: string;
}

interface AddPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (violation: any) => void;
  students: Student[];
  kelas: Kelas[];
}

export default function AddPelanggaranDialog({
  open,
  onOpenChange,
  onAdd,
  students,
  kelas,
}: AddPelanggaranDialogProps) {
  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    class: "",
    violationType: "",
    severity: "",
    points: 0,
    date: "",
    description: "",
    lokasi: "",
    tindakan: "",
    catatan: "",
    status: "Aktif",
  });

  const [buktiFiles, setBuktiFiles] = useState<BuktiFile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (form.studentName.trim()) {
      const filtered = students.filter((s) =>
        s.nama.toLowerCase().includes(form.studentName.toLowerCase())
      );
      setFilteredStudents(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredStudents([]);
      setShowSuggestions(false);
    }
  }, [form.studentName, students]);

  useEffect(() => {
    let point = 0;
    if (form.severity === "Ringan") point = 5;
    else if (form.severity === "Sedang") point = 10;
    else if (form.severity === "Berat") point = 25;

    setForm((prev) => ({ ...prev, points: point }));
  }, [form.severity]);

  const getKelasName = (kelasId: number) =>
    kelas.find((k) => k.id === kelasId)?.nama || "";

  const handleChange = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setForm((prev) => ({
      ...prev,
      studentName: student.nama,
      studentId: student.nis,
      class: getKelasName(student.kelas_id),
    }));
    setShowSuggestions(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const newBukti: BuktiFile = {
        file,
        deskripsi: "",
      };

      // Create preview untuk gambar
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newBukti.preview = e.target?.result as string;
          setBuktiFiles((prev) => [...prev, newBukti]);
        };
        reader.readAsDataURL(file);
      } else {
        setBuktiFiles((prev) => [...prev, newBukti]);
      }
    });

    // Reset input file
    event.target.value = "";
  };

  const removeBukti = (index: number) => {
    setBuktiFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBuktiDeskripsi = (index: number, deskripsi: string) => {
    setBuktiFiles((prev) =>
      prev.map((b, i) => (i === index ? { ...b, deskripsi } : b))
    );
  };

  const resetForm = () => {
    setForm({
      studentName: "",
      studentId: "",
      class: "",
      violationType: "",
      severity: "",
      points: 0,
      date: "",
      description: "",
      lokasi: "",
      tindakan: "",
      catatan: "",
      status: "Aktif",
    });
    setSelectedStudent(null);
    setBuktiFiles([]);
    setShowSuggestions(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      alert("Pilih siswa terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Buat FormData untuk mengirim file
      const formData = new FormData();

      // Tambahkan data form
      formData.append("siswa_id", selectedStudent.id.toString());
      formData.append("jenis_pelanggaran", form.violationType);
      formData.append("tingkat", form.severity);
      formData.append("poin", form.points.toString());
      formData.append("tanggal", form.date);
      formData.append(
        "waktu",
        new Date().toLocaleTimeString("en-GB", { hour12: false })
      );
      formData.append("lokasi", form.lokasi);
      formData.append("deskripsi", form.description);
      formData.append("tindakan", form.tindakan);
      formData.append("catatan", form.catatan);
      formData.append("status", form.status);
      formData.append("tanggal_tindak_lanjut", form.date);

      // Tambahkan file bukti
      buktiFiles.forEach((bukti, index) => {
        formData.append(`bukti_files[${index}]`, bukti.file);
        formData.append(`bukti_descriptions[${index}]`, bukti.deskripsi);
      });

      // Panggil onAdd dengan FormData
      await onAdd(formData);

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan pelanggaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">+ Tambah Pelanggaran</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Pilih siswa */}
          <div className="relative space-y-2">
            <Label>Nama Siswa</Label>
            <Input
              placeholder="Ketik nama siswa..."
              value={form.studentName}
              onChange={(e) => {
                handleChange("studentName", e.target.value);
                if (
                  selectedStudent &&
                  e.target.value !== selectedStudent.nama
                ) {
                  setSelectedStudent(null);
                  handleChange("studentId", "");
                  handleChange("class", "");
                }
              }}
              onFocus={() => form.studentName && setShowSuggestions(true)}
            />
            {showSuggestions && filteredStudents.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded shadow z-10 max-h-40 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className="cursor-pointer p-2 hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <div className="font-medium">{student.nama}</div>
                    <div className="text-xs text-gray-600">
                      NIS: {student.nis} - Kelas:{" "}
                      {getKelasName(student.kelas_id)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input value={form.studentId} readOnly placeholder="NIS" />
          <Input value={form.class} readOnly placeholder="Kelas" />

          <Select
            value={form.violationType}
            onValueChange={(v) => handleChange("violationType", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Jenis Pelanggaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Terlambat Masuk">Terlambat Masuk</SelectItem>
              <SelectItem value="Tidak Memakai Seragam">
                Tidak Memakai Seragam
              </SelectItem>
              <SelectItem value="Merokok">Merokok</SelectItem>
              <SelectItem value="Berkelahi">Berkelahi</SelectItem>
              <SelectItem value="Membolos">Membolos</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.severity}
            onValueChange={(v) => handleChange("severity", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tingkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ringan">Ringan</SelectItem>
              <SelectItem value="Sedang">Sedang</SelectItem>
              <SelectItem value="Berat">Berat</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Poin"
            value={form.points}
            readOnly
          />

          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <Input
            placeholder="Lokasi Kejadian"
            value={form.lokasi}
            onChange={(e) => handleChange("lokasi", e.target.value)}
          />
          <Input
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Label>Tindakan</Label>
          <Textarea
            placeholder="Tindakan yang dilakukan"
            value={form.tindakan}
            onChange={(e) => handleChange("tindakan", e.target.value)}
          />

          <Label>Catatan</Label>
          <Textarea
            placeholder="Catatan tambahan"
            value={form.catatan}
            onChange={(e) => handleChange("catatan", e.target.value)}
          />

          {/* Upload bukti */}
          <div className="space-y-2">
            <Label>Tambah Bukti (Foto/File)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Pilih File
              </Button>
              <input
                id="file-input"
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                Maksimal 10MB per file
              </span>
            </div>
          </div>

          {/* List bukti & edit deskripsi */}
          <div className="space-y-2">
            {buktiFiles.map((bukti, idx) => (
              <div key={idx} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 flex-1">
                    {bukti.file.type.startsWith("image/") ? (
                      <Image className="w-4 h-4 text-blue-500" />
                    ) : (
                      <File className="w-4 h-4 text-gray-500" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {bukti.file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(bukti.file.size)} • {bukti.file.type}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBukti(idx)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {/* Preview untuk gambar */}
                {bukti.preview && (
                  <div className="mt-2">
                    <img
                      src={bukti.preview}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}

                <Input
                  placeholder="Deskripsi bukti..."
                  value={bukti.deskripsi}
                  onChange={(e) => updateBuktiDeskripsi(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}