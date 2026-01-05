'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/today', label: 'Today', icon: '/assets/nav/today.png' },
    { href: '/calendar', label: 'Calendar', icon: '/assets/nav/calendar.png' },
    { href: '/goals', label: 'Goals', icon: '/assets/nav/goals.png' },
    { href: '/settings', label: 'Settings', icon: '/assets/nav/settings.png' },
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
                    ? 'bg-amber-50/50 dark:bg-amber-900/20 scale-110'
                    : 'hover:bg-stone-100/30 dark:hover:bg-stone-800/30 hover:scale-105'
                }`}
              >
                <div className={`relative transition-all duration-300 ${
                  isActive ? 'drop-shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                    className={`transition-transform duration-300 ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-stone-500 dark:text-stone-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
