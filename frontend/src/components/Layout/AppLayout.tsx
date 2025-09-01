'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Navbar from '@/components/Layout/Topbar';

import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
