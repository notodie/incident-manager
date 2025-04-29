'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  HomeIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: HomeIcon },
    { path: '/incidents', label: 'Incidents', icon: ExclamationTriangleIcon },
    { path: '/plans', label: 'Plans de continuité', icon: DocumentTextIcon },
    { path: '/tasks', label: 'Tâches', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-64 bg-[#6366F1] text-white">
        <div className="p-6">
          <span className="text-2xl font-bold">IM</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-150 ease-in-out ${
                  isActive(item.path)
                    ? 'bg-white text-[#6366F1] font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center w-full px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors duration-150 ease-in-out"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50">
        <main className="p-8">
          {/* Le contenu de la page sera rendu ici */}
        </main>
      </div>
    </div>
  );
} 