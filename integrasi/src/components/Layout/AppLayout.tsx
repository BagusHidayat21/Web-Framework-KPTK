'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();

  const verifyToken = async () => {
    try {
      const response = await api.post('/verify-token');
      if (response.data.status === 'error') {
        console.error('Token verification failed:', response.data.message);
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    verifyToken();
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
