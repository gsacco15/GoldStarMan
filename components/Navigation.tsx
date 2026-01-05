'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GoldStar from './GoldStar';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/today', label: 'Today', icon: 'star' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/goals', label: 'Goals', icon: '🎯' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-stone-200/50 dark:border-stone-800/50 z-50 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20 scale-105'
                    : 'text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100/30 dark:hover:bg-stone-800/30'
                }`}
              >
                {item.icon === 'star' ? (
                  <GoldStar size={28} animate={isActive} />
                ) : (
                  <span className="text-3xl">{item.icon}</span>
                )}
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
