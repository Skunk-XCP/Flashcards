'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initializeDefaultData } from '../lib/initData';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialiser les données par défaut au premier chargement
    initializeDefaultData();
  }, []);

  const navItems = [
    { href: '/', label: '🎴 Révision', icon: '🎴' },
    { href: '/create', label: '✨ Création', icon: '✨' },
    { href: '/stats', label: '📊 Stats', icon: '📊' },
    { href: '/settings', label: '⚙️ Paramètres', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold hover:opacity-80 transition">
              🎴 Flashcards
            </Link>
            
            <div className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'bg-white text-blue-600 font-semibold shadow-md'
                      : 'hover:bg-white/20'
                  }`}
                >
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden text-xl">{item.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Made with ❤️ | Flashcards App - Apprenez efficacement
          </p>
        </div>
      </footer>
    </div>
  );
}
