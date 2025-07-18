"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();

  const menuMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/siswa': 'Siswa',
    '/dashboard/jurusan': 'Jurusan',
    '/dashboard/kelas': 'Kelas',
    '/dashboard/pararel': 'Pararel',
    '/dashboard/mapel': 'Mata Pelajaran',
  };

  const title = menuMap[pathname] || 'Dashboard';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="lg:hidden mr-4">
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
