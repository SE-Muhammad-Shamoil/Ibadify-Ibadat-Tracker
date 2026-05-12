'use client';

import React from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import { getStreak } from '@/lib/firebase/firestore';
import { Heatmap } from '@/components/history/Heatmap';
import { Trophy, CalendarCheck } from '@phosphor-icons/react';

export default function HistoryPage() {
  const { user } = useAuth();
  
  const { data: streak, isLoading } = useSWR(
    user ? `streaks/${user.uid}` : null,
    () => getStreak(user!.uid)
  );

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-dust border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full pb-20">
      <div className="mb-12">
        <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal mb-2">
          History & Journey
        </h1>
        <p className="text-charcoal/60 text-[15px]">
          Visualize your consistency and spiritual growth over time.
        </p>
      </div>

      <div className="space-y-12">
        {/* Streak Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-border-warm shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Trophy weight="duotone" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">Longest Streak</p>
              <p className="text-2xl font-bold text-charcoal">{streak?.longestStreak || 0} Days</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border-warm shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-dust/10 flex items-center justify-center text-teal-dust">
              <CalendarCheck weight="duotone" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">Total Days Tracked</p>
              <p className="text-2xl font-bold text-charcoal">
                {Object.keys(streak?.streakHistory || {}).length} Days
              </p>
            </div>
          </div>
        </section>

        {/* Heatmap Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Activity Map</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <Heatmap data={streak?.streakHistory || {}} />
        </section>
      </div>
    </div>
  );
}
