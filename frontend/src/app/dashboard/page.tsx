"use client";

import React, { useEffect, useState } from "react";
import { Users, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SiswaChart from "@/components/Dashboard/SiswaChart";
import GenderRatioChart from "@/components/Dashboard/GenderRatioChart";
import ViolationTrendChart from "@/components/Dashboard/TrenPelanggaran";
import ViolationTypesList from "@/components/Dashboard/TipePelanggaran";
import TingkatPelanggaranList from "@/components/Dashboard/TingkatPelanggaran";
import TopViolatorsList from "@/components/Dashboard/TopPelanggaran";
import BirthYearDistribution from "@/components/Dashboard/BirthYearDistribution";
import { DataTahunLahir, DataBar, DataPie, ViolationStats } from "@/types";

// Tipe data

export default function DashboardPage() {
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

  useEffect(() => {
    setTotalSiswa(250);
    setTotalKelas(10);
    setPieData([
      { name: "Laki-Laki", value: 150 },
      { name: "Perempuan", value: 100 },
    ]);
    setBarData([
      { nama_kelas: "XII RPL 1", "Laki-Laki": 15, Perempuan: 10 },
      { nama_kelas: "XII RPL 2", "Laki-Laki": 13, Perempuan: 12 },
    ]);
    setYearData([
      { year: 2006, count: 50 },
      { year: 2007, count: 100 },
    ]);
    setViolationStats({
      totalViolations: 45,
      monthlyViolations: [
        { month: "Jan", violations: 10, resolved: 8 },
        { month: "Feb", violations: 15, resolved: 10 },
        { month: "Mar", violations: 20, resolved: 12 },
        { month: "Apr", violations: 25, resolved: 15 },
        { month: "May", violations: 30, resolved: 18 },
        { month: "Jun", violations: 35, resolved: 20 },
        { month: "Jul", violations: 40, resolved: 22 },
        { month: "Aug", violations: 45, resolved: 25 },
        { month: "Sep", violations: 50, resolved: 28 },
        { month: "Oct", violations: 55, resolved: 30 },
        { month: "Nov", violations: 60, resolved: 32 },
        { month: "Dec", violations: 65, resolved: 35 },
      ],
      violationTypes: [
        { type: "Terlambat", count: 20, percentage: 44 },
        { type: "Tidak Pakai Seragam", count: 15, percentage: 33 },
      ],
      severityDistribution: [
        { severity: "Ringan", count: 30, color: "#22c55e" },
        { severity: "Sedang", count: 20, color: "#3b82f6" },
        { severity: "Berat", count: 15, color: "#ef4444" },
      ],
      topViolators: [
        { name: "XII RPL 1", violations: 20 },
        { name: "XII RPL 2", violations: 15 },
      ],
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Siswa
        </h1>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Siswa" value={totalSiswa} icon={Users} color="bg-blue-500" subtitle="Siswa aktif" badge="Aktif" />
          <StatCard title="Kelas" value={totalKelas} icon={GraduationCap} color="bg-green-500" subtitle="Kelas aktif" />
          <StatCard title="Rata-rata/Kelas" value={totalKelas ? Math.round(totalSiswa / totalKelas) : 0} icon={TrendingUp} color="bg-amber-500" subtitle="Siswa per kelas" />
          <StatCard title="Pelanggaran" value={violationStats.totalViolations} icon={AlertTriangle} color="bg-red-500" subtitle="Total pelanggaran" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SiswaChart data={barData} />
          <GenderRatioChart data={pieData} />
          <ViolationTrendChart data={violationStats.monthlyViolations} />
          <ViolationTypesList data={violationStats.violationTypes} total={violationStats.totalViolations} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TingkatPelanggaranList data={violationStats.severityDistribution} />
          <TopViolatorsList data={violationStats.topViolators} />
        </div>

        {/* Birth Year Distribution */}
        <BirthYearDistribution data={yearData} />
      </div>
    </div>
  );
}

// Komponen Kartu Statistik
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
  badge?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle, badge }: StatCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}