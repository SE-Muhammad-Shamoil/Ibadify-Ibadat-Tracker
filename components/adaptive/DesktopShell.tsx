'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, ListChecks, MoonStars, ClockCounterClockwise, User, CaretLeft, CaretRight, ChartLineUp } from '@phosphor-icons/react';
import { PageTransition } from './PageTransition';
import { useAuth } from '@/lib/context/AuthContext';

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: House },
    { name: 'Tracker', path: '/tracker', icon: ListChecks },
    { name: 'Nightly Review', path: '/review', icon: MoonStars },
    { name: 'Qaza Debt', path: '/qaza', icon: ClockCounterClockwise },
    { name: 'Insights', path: '/insights', icon: ChartLineUp },
  ];

  return (
    <div className="flex h-screen w-full bg-cream overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`relative flex flex-col bg-white border-r border-border-warm transition-[width] duration-250 ease-out z-20 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border-warm rounded-full flex items-center justify-center text-charcoal/50 hover:text-charcoal shadow-sm transition-colors z-30"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <CaretRight weight="bold" /> : <CaretLeft weight="bold" />}
        </button>

        {/* Logo Area */}
        <div className={`h-[72px] flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-border-warm/50`}>
          <div className="w-8 h-8 rounded-md bg-teal-dust text-white flex items-center justify-center font-bold flex-shrink-0">
            I
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-[family-name:var(--font-lora)] text-xl font-medium text-charcoal tracking-tight whitespace-nowrap overflow-hidden">
              Ibadify
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center h-10 rounded-md transition-colors ${
                  isCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive 
                    ? 'bg-teal-dust/10 text-teal-dust font-medium' 
                    : 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon weight={isActive ? 'fill' : 'regular'} className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-[14px] whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Settings Profile Area */}
        <div className="p-3 border-t border-border-warm/50 mt-auto">
          <Link 
            href="/settings"
            className={`flex items-center h-10 rounded-md transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              pathname.startsWith('/settings')
                ? 'bg-teal-dust/10 text-teal-dust font-medium' 
                : 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal'
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            {user?.photoURL ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full flex-shrink-0" />
              </>
            ) : (
              <User weight={pathname.startsWith('/settings') ? 'fill' : 'regular'} className="w-5 h-5 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="ml-3 text-[14px] truncate">
                {user?.displayName || 'Settings'}
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-cream">
        <div className="max-w-7xl mx-auto w-full h-full p-6 md:p-8 flex flex-col">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
