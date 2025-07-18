"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, GraduationCap, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SiswaChart from "@/components/Dashboard/SiswaChart";
import GenderRatioChart from "@/components/Dashboard/GenderRatioChart";
import ViolationTrendChart from "@/components/Dashboard/TrenPelanggaran";
import ViolationTypesList from "@/components/Dashboard/TipePelanggaran";
import TingkatPelanggaranList from "@/components/Dashboard/TingkatPelanggaran";
import TopViolatorsList from "@/components/Dashboard/TopPelanggaran";
import BirthYearDistribution from "@/components/Dashboard/BirthYearDistribution";

export default function DashboardPage() {
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalKelas, setTotalKelas] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [violationStats, setViolationStats] = useState({
    totalViolations: 0,
    monthlyViolations: [],
    violationTypes: [],
    severityDistribution: [],
    topViolators: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        const data = res.data;
        setTotalSiswa(data.totalSiswa);
        setTotalKelas(data.totalKelas);
        setPieData(data.pie_data);
        setBarData(data.bar_data);
        setYearData(data.bar_data_birthyear);

        // Mock data untuk violationStats (ganti dengan data asli dari API)
        setViolationStats({
          totalViolations: 247,
          monthlyViolations: [
            { month: "Jan", violations: 45, resolved: 42 },
            { month: "Feb", violations: 52, resolved: 48 },
            { month: "Mar", violations: 38, resolved: 35 },
            { month: "Apr", violations: 41, resolved: 39 },
            { month: "May", violations: 35, resolved: 33 },
            { month: "Jun", violations: 36, resolved: 34 },
          ],
          violationTypes: [
            { type: "Terlambat", count: 89, percentage: 36 },
            { type: "Uniform", count: 52, percentage: 21 },
            { type: "Absen", count: 43, percentage: 17 },
            { type: "Gadget", count: 34, percentage: 14 },
            { type: "Lainnya", count: 29, percentage: 12 },
          ],
          severityDistribution: [
            { severity: "Ringan", count: 142, color: "#22c55e" },
            { severity: "Sedang", count: 78, color: "#f59e0b" },
            { severity: "Berat", count: 27, color: "#ef4444" },
          ],
          topViolators: [
            { name: "Kelas X-1", violations: 23 },
            { name: "Kelas XI-2", violations: 19 },
            { name: "Kelas XII-1", violations: 16 },
          ],
        });
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-left">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Siswa
          </h1>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Siswa" value={totalSiswa} icon={Users} color="bg-blue-500" subtitle="Siswa aktif" badge="Aktif" />
          <StatCard title="Kelas" value={totalKelas} icon={GraduationCap} color="bg-green-500" subtitle="Kelas aktif" />
          <StatCard title="Rata-rata/Kelas" value={totalKelas > 0 ? Math.round(totalSiswa / totalKelas) : 0} icon={TrendingUp} color="bg-amber-500" subtitle="Siswa per kelas" />
          <StatCard title="Pelanggaran" value={violationStats.totalViolations} icon={AlertTriangle} color="bg-red-500" subtitle="Bulan ini" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Students by Class */}
          <SiswaChart data={barData} />

          {/* Gender Ratio */}
          <GenderRatioChart data={pieData} />

          {/* Violation Trend */}
          <ViolationTrendChart data={violationStats.monthlyViolations} />

          {/* Violation Types */}
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

// Komponen StatCard
function StatCard({ title, value, icon: Icon, color, subtitle, badge }: any) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline space-x-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
