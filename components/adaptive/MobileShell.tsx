'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, ListChecks, MoonStars, ClockCounterClockwise, User } from '@phosphor-icons/react';
import { PageTransition } from './PageTransition';

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: House },
    { name: 'Tracker', path: '/tracker', icon: ListChecks },
    { name: 'Review', path: '/review', icon: MoonStars },
    { name: 'Qaza', path: '/qaza', icon: ClockCounterClockwise },
    { name: 'Profile', path: '/settings', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-cream overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full h-[72px] bg-white border-t border-border-warm flex items-center justify-around px-2 z-50 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive ? 'text-teal-dust' : 'text-charcoal/50 hover:text-charcoal/80'
              }`}
            >
              <Icon weight={isActive ? 'fill' : 'regular'} className="w-6 h-6" />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
