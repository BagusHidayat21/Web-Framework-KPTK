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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth/login';
    } else {
      api.post('/verify-token', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (res.status !== 200) {
            alert('Token Tidak Valid!');
            window.location.href = '/auth/login';
          }
        })
        .catch(() => {
          window.location.href = '/auth/login';
        });
    }
  }, []);
  
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
