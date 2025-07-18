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

// API Response Types
interface ApiPelanggaranTren {
  bulan: string;
  Aktif: number;
  Selesai: number;
}

interface ApiPelanggaranJenis {
  jenis_pelanggaran: string;
  total: number;
}

interface ApiPelanggaranTingkat {
  tingkat: string;
  total: number;
}

interface ApiPelanggaranKelas {
  kelas: string;
  total: number;
}

interface ApiPieData {
  name: string;
  value: number;
}

interface ApiBarData {
  nama_kelas: string;
  'Laki-Laki': number;
  Perempuan: number;
}

interface ApiYearData {
  year: string;
  count: number;
}

interface ApiDashboardResponse {
  totalSiswa: number;
  totalKelas: number;
  pie_data: ApiPieData[];
  bar_data: ApiBarData[];
  bar_data_birthyear: ApiYearData[];
  totalPelanggaran: number;
  pelanggaranTren: ApiPelanggaranTren[];
  pelanggaranPerJenis: ApiPelanggaranJenis[];
  pelanggaranPerTingkat: ApiPelanggaranTingkat[];
  pelanggaranPerKelas: ApiPelanggaranKelas[];
  activeViolations?: number;
  resolvedViolations?: number;
  resolutionRate?: number;
}

// Frontend Types
type MonthlyViolation = {
  month: string;
  violations: number;
  resolved: number;
};

type ViolationType = {
  type: string;
  count: number;
  percentage: number;
};

type SeverityItem = {
  severity: string;
  count: number;
  color: string;
};

type TopViolator = {
  name: string;
  violations: number;
};

type ViolationStats = {
  totalViolations: number;
  monthlyViolations: MonthlyViolation[];
  violationTypes: ViolationType[];
  severityDistribution: SeverityItem[];
  topViolators: TopViolator[];
};

export default function DashboardPage() {
  const [totalSiswa, setTotalSiswa] = useState<number>(0);
  const [totalKelas, setTotalKelas] = useState<number>(0);
  const [pieData, setPieData] = useState<ApiPieData[]>([]);
  const [barData, setBarData] = useState<ApiBarData[]>([]);
  const [yearData, setYearData] = useState<ApiYearData[]>([]);
  const [violationStats, setViolationStats] = useState<ViolationStats>({
    totalViolations: 0,
    monthlyViolations: [],
    violationTypes: [],
    severityDistribution: [],
    topViolators: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to get month name
  const getMonthName = (yearMonth: string): string => {
    const months: Record<string, string> = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };
    const month = yearMonth.split('-')[1];
    return months[month] || yearMonth;
  };

  // Helper function to get severity color
  const getSeverityColor = (tingkat: string): string => {
    const colors: Record<string, string> = {
      'Ringan': '#22c55e',
      'Sedang': '#f59e0b', 
      'Berat': '#ef4444'
    };
    return colors[tingkat] || '#6b7280';
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/stats");
        const data: ApiDashboardResponse = res.data;
        
        // Set basic data
        setTotalSiswa(data.totalSiswa);
        setTotalKelas(data.totalKelas);
        setPieData(data.pie_data);
        setBarData(data.bar_data);
        setYearData(data.bar_data_birthyear);

        // Process pelanggaran data
        const processedViolationStats: ViolationStats = {
          totalViolations: data.totalPelanggaran || 0,
          
          // Process monthly violations (tren)
          monthlyViolations: data.pelanggaranTren?.map((item: ApiPelanggaranTren) => ({
            month: getMonthName(item.bulan),
            violations: (item.Aktif || 0) + (item.Selesai || 0),
            resolved: item.Selesai || 0
          })) || [],
          
          // Process violation types
          violationTypes: data.pelanggaranPerJenis?.map((item: ApiPelanggaranJenis) => ({
            type: item.jenis_pelanggaran,
            count: item.total,
            percentage: data.totalPelanggaran > 0 ? Math.round((item.total / data.totalPelanggaran) * 100) : 0
          })) || [],
          
          // Process severity distribution
          severityDistribution: data.pelanggaranPerTingkat?.map((item: ApiPelanggaranTingkat) => ({
            severity: item.tingkat,
            count: item.total,
            color: getSeverityColor(item.tingkat)
          })) || [],
          
          // Process top violators (kelas with most violations)
          topViolators: data.pelanggaranPerKelas?.slice(0, 5).map((item: ApiPelanggaranKelas) => ({
            name: item.kelas,
            violations: item.total
          })) || []
        };

        setViolationStats(processedViolationStats);
        
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
        
        // Set default empty data on error
        setViolationStats({
          totalViolations: 0,
          monthlyViolations: [],
          violationTypes: [],
          severityDistribution: [],
          topViolators: [],
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

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
            value={totalKelas > 0 ? Math.round(totalSiswa / totalKelas) : 0} 
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Students by Class */}
          <SiswaChart data={barData} />

          {/* Gender Ratio */}
          <GenderRatioChart data={pieData} />

          {/* Violation Trend */}
          <ViolationTrendChart data={violationStats.monthlyViolations} />

          {/* Violation Types */}
          <ViolationTypesList 
            data={violationStats.violationTypes} 
            total={violationStats.totalViolations} 
          />
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

// StatCard Props Interface
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
  badge?: string;
}

// Komponen StatCard
function StatCard({ title, value, icon: Icon, color, subtitle, badge }: StatCardProps) {
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