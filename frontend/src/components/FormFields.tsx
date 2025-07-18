"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldsProps {
  data: any;
  onChange: (key: string, value: string | number) => void;
  kelas: { id: number; nama: string }[];
  jurusan: { id: number; nama: string }[];
  pararel: { id: number; nama: string }[];
}

export default function FormFields({
  data,
  onChange,
  kelas,
  jurusan,
  pararel,
}: FormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama</Label>
        <Input
          value={data.nama}
          onChange={(e) => onChange("nama", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nis">NIS</Label>
        <Input
          value={data.nis}
          onChange={(e) => onChange("nis", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Kelas</Label>
        <Select onValueChange={(val) => onChange("kelas_id", Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {kelas.map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>
                {k.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Jurusan</Label>
        <Select onValueChange={(val) => onChange("jurusan_id", Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Jurusan" />
          </SelectTrigger>
          <SelectContent>
            {jurusan.map((j) => (
              <SelectItem key={j.id} value={String(j.id)}>
                {j.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Pararel</Label>
        <Select onValueChange={(val) => onChange("pararel_id", Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Pararel" />
          </SelectTrigger>
          <SelectContent>
            {pararel.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Jenis Kelamin</Label>
        <Select onValueChange={(val) => onChange("jenis_kelamin", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Jenis Kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Laki-laki</SelectItem>
            <SelectItem value="P">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Tanggal Lahir</Label>
        <Input
          type="date"
          value={data.tanggal_lahir}
          onChange={(e) => onChange("tanggal_lahir", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Alamat</Label>
        <Input
          value={data.alamat}
          onChange={(e) => onChange("alamat", e.target.value)}
        />
      </div>
    </div>
  );
}
