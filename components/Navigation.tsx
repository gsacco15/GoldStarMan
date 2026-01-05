'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/today', label: 'Today', icon: '⭐' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/goals', label: 'Goals', icon: '🎯' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
