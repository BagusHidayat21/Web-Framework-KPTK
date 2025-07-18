'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Settings,
  Home,
  X,
  BookOpen,
  Clipboard,
  ChartBar,
} from 'lucide-react';

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/siswa', label: 'Data Siswa', icon: Users },
    { href: '/kelas', label: 'Kelas', icon: ChartBar }
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;
