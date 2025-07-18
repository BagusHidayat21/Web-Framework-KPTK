'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, GraduationCap, TrendingUp, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  // Data siswa per kelas berdasarkan jenis kelamin
  const genderByClassData = [
    { kelas: '10A', laki: 15, perempuan: 13 },
    { kelas: '10B', laki: 12, perempuan: 16 },
    { kelas: '11A', laki: 14, perempuan: 12 },
    { kelas: '11B', laki: 16, perempuan: 14 },
    { kelas: '12A', laki: 13, perempuan: 15 },
    { kelas: '12B', laki: 11, perempuan: 17 },
  ];

  // Data rasio jenis kelamin keseluruhan
  const genderRatioData = [
    { name: 'Laki-laki', value: 81, percentage: 48.8 },
    { name: 'Perempuan', value: 87, percentage: 51.2 },
  ];

  // Data tahun kelahiran siswa
  const birthYearData = [
    { name: '2006', value: 45, percentage: 26.8 },
    { name: '2007', value: 52, percentage: 31.0 },
    { name: '2008', value: 48, percentage: 28.6 },
    { name: '2009', value: 23, percentage: 13.7 },
  ];

  // Palet warna yang lebih soft dan elegant
  const COLORS = ['#38bdf8', '#fb923c', '#34d399', '#fbbf24', '#a78bfa', '#22d3ee'];

  const totalSiswa = genderRatioData.reduce((sum, item) => sum + item.value, 0);
  const totalKelas = genderByClassData.length;

  return (
    <div className="min-h-screen bg-white-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan gradient dan shadow */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-3">
            Dashboard Siswa
          </h1>
          <p className="text-slate-600 text-lg">Ringkasan data siswa dan analisis demografis</p>
          <div className="w-24 h-1 bg-black mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Cards Summary dengan gradient dan hover effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Siswa</CardTitle>
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{totalSiswa}</div>
              <p className="text-xs text-slate-500 mt-1">Siswa aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Kelas</CardTitle>
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{totalKelas}</div>
              <p className="text-xs text-slate-500 mt-1">Kelas aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Rata-rata/Kelas</CardTitle>
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{Math.round(totalSiswa / totalKelas)}</div>
              <p className="text-xs text-slate-500 mt-1">Siswa per kelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid dengan spacing yang lebih baik */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Bar Chart dengan warna yang lebih soft */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                Distribusi Jenis Kelamin per Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={genderByClassData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="kelas" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="laki" name="Laki-laki" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="perempuan" name="Perempuan" fill="#fb923c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart dengan gradasi warna */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                Rasio Jenis Kelamin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={genderRatioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {genderRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : '#fb923c'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart Tahun Kelahiran */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                Distribusi Tahun Kelahiran Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={360}>
                  <PieChart>
                    <Pie
                      data={birthYearData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage > 10 ? `${percentage}%` : ''})`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={3}
                      stroke="#fff"
                    >
                      {birthYearData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}