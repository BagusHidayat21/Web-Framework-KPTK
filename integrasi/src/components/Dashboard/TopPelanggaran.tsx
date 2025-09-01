"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

type Violator = {
  name: string;
  violations: number;
};

export default function TopViolatorsList({ data }: { data: Violator[] }) {
  // Urutkan data dari yang paling banyak pelanggaran
  const sortedData = [...data].sort((a, b) => b.violations - a.violations);

  // Ambil top 5
  const top5 = sortedData.slice(0, 5);

  // Hitung sisanya
  const others = sortedData.slice(5);
  const othersTotal = others.reduce((sum, v) => sum + v.violations, 0);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-red-500" />
          Pelanggaran Terbanyak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top5.map((violator, index) => (
            <div key={violator.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">{index + 1}</span>
                </div>
                <span className="font-medium">{violator.name}</span>
              </div>
              <Badge variant="destructive">{violator.violations}</Badge>
            </div>
          ))}

          {/* Tambahin baris "Lainnya" kalau ada lebih dari 5 */}
          {others.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">+</span>
                </div>
                <span className="font-medium text-gray-600">Lainnya</span>
              </div>
              <Badge variant="secondary">{othersTotal}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
