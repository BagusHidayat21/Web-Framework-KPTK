"use client";

import React, { useEffect, useState } from "react";
import { Users, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react"; 
// Icon dari lucide-react untuk visualisasi kartu statistik

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
// Komponen UI shadcn untuk kartu
import { Badge } from "@/components/ui/badge"; 

// Import komponen chart & list (modularisasi data visualisasi)
import SiswaChart from "@/components/Dashboard/SiswaChart";
import GenderRatioChart from "@/components/Dashboard/GenderRatioChart";
import ViolationTrendChart from "@/components/Dashboard/TrenPelanggaran";
import ViolationTypesList from "@/components/Dashboard/TipePelanggaran";
import TingkatPelanggaranList from "@/components/Dashboard/TingkatPelanggaran";
import TopViolatorsList from "@/components/Dashboard/TopPelanggaran";
import BirthYearDistribution from "@/components/Dashboard/BirthYearDistribution";

import { api } from "@/lib/api"; // API wrapper (axios/fetch instance)
import { DataTahunLahir, DataBar, DataPie, ViolationStats } from "@/types"; 
// TypeScript interface untuk data (supaya type-safe)

// ---------- Props untuk Komponen Kartu Statistik ----------
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
  badge?: string;
}

// ---------- Halaman Utama Dashboard ----------
export default function DashboardPage() {
  // State utama untuk simpan data dari API
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalKelas, setTotalKelas] = useState(0);
  const [pieData, setPieData] = useState<DataPie[]>([]);
  const [barData, setBarData] = useState<DataBar[]>([]);
  const [yearData, setYearData] = useState<DataTahunLahir[]>([]);
  const [violationStats, setViolationStats] = useState<ViolationStats>({
    totalViolations: 0,
    monthlyViolations: [],
    violationTypes: [],
    severityDistribution: [],
    topViolators: [],
  });

  // Ambil data dari backend saat pertama kali render
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Panggil endpoint API
        const res = await api.get('/dashboard/stats');
        const data = res.data;

        // Mapping data API ke state sesuai kebutuhan UI
        setTotalSiswa(data.totalSiswa);
        setTotalKelas(data.totalKelas);
        setPieData(data.pie_data);
        setBarData(data.bar_data);
        setYearData(data.bar_data_birthyear);

        // Normalisasi data pelanggaran ke dalam state ViolationStats
        setViolationStats({
          totalViolations: data.totalPelanggaran,
          monthlyViolations: data.pelanggaranTren.map((item: any) => ({
            month: item.bulan,
            violations: item.Aktif,
            resolved: item.Selesai,
          })),
          violationTypes: data.pelanggaranPerJenis.map((item: any) => ({
            type: item.jenis_pelanggaran,
            count: item.total,
            percentage: 0, // bisa dihitung belakangan
          })),
          severityDistribution: data.pelanggaranPerTingkat.map((item: any) => ({
            severity: item.tingkat,
            count: item.total,
            color: item.tingkat === "Ringan" ? "#22c55e"  // Hijau
                  : item.tingkat === "Sedang" ? "#3b82f6"  // Biru
                  : "#ef4444",                            // Merah
          })),
          topViolators: data.pelanggaranPerKelas.map((item: any) => ({
            name: item.kelas,
            violations: item.total,
          })),
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchData(); // jalankan saat komponen mount
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ---------- Header ---------- */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Siswa
        </h1>

        {/* ---------- Kartu Statistik Utama ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Siswa" 
            value={totalSiswa} 
            icon={Users} 
            color="bg-blue-500" 
            subtitle="Siswa aktif" 
            badge="Aktif" 
          />
          <StatCard 
            title="Kelas" 
            value={totalKelas} 
            icon={GraduationCap} 
            color="bg-green-500" 
            subtitle="Kelas aktif" 
          />
          <StatCard 
            title="Rata-rata/Kelas" 
            value={totalKelas ? Math.round(totalSiswa / totalKelas) : 0} 
            icon={TrendingUp} 
            color="bg-amber-500" 
            subtitle="Siswa per kelas" 
          />
          <StatCard 
            title="Pelanggaran" 
            value={violationStats.totalViolations} 
            icon={AlertTriangle} 
            color="bg-red-500" 
            subtitle="Total pelanggaran" 
          />
        </div>

        {/* ---------- Chart Section ---------- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SiswaChart data={barData} />
          <GenderRatioChart data={pieData} />
          <ViolationTrendChart data={violationStats.monthlyViolations} />
          <ViolationTypesList 
            data={violationStats.violationTypes} 
            total={violationStats.totalViolations} 
          />
        </div>

        {/* ---------- Additional Data ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TingkatPelanggaranList data={violationStats.severityDistribution} />
          <TopViolatorsList data={violationStats.topViolators} />
        </div>

        {/* Distribusi Tahun Lahir */}
        <BirthYearDistribution data={yearData} />
      </div>
    </div>
  );
}

// ---------- Komponen Kartu Statistik ----------
function StatCard({ title, value, icon: Icon, color, subtitle, badge }: StatCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        {/* Judul & Badge */}
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>

        {/* Ikon dengan background warna */}
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>

      {/* Value + Subtitle */}
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
