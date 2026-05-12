'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export function GreetingHeader() {
  const { user } = useAuth();
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Assalamu Alaikum';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Assalamu Alaikum';
  }, []);

  const gregorianDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }, []);

  const hijriDate = useMemo(() => {
    // Using Intl for Hijri date
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="flex flex-col gap-1 mb-8">
      <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal">
        {greeting}, {user?.displayName?.split(' ')[0] || 'Seeker'}
      </h1>
      <div className="flex items-center gap-2 text-[15px] text-charcoal/60">
        <span>{gregorianDate}</span>
        <span className="w-1 h-1 rounded-full bg-charcoal/20" />
        <span className="font-medium text-teal-dust">{hijriDate}</span>
      </div>
    </div>
  );
}
