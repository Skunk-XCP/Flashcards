'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Révision' },
    { href: '/create', label: 'Création' },
    { href: '/stats', label: 'Stats' },
    { href: '/settings', label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded transition ${
                pathname === item.href
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
