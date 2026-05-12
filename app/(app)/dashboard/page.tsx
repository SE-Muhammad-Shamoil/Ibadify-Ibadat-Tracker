'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserProfile, getDailyLog, getStreak } from '@/lib/firebase/firestore';
import { getTodayStringInTimezone } from '@/lib/utils/timezone';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { QuickStats } from '@/components/dashboard/QuickStats';

export default function DashboardPage() {
  const { user } = useAuth();

  // 1. Fetch User Profile (to get timezone, targets, etc.)
  const { data: profile, error: profileError } = useSWR(
    user ? `users/${user.uid}` : null,
    () => getUserProfile(user!.uid)
  );

  const timezone = profile?.homeTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const todayStr = useMemo(() => getTodayStringInTimezone(timezone), [timezone]);

  // 2. Fetch Today's Daily Log
  const { data: todayLog, error: logError } = useSWR(
    user ? `logs/${user.uid}/${todayStr}` : null,
    () => getDailyLog(user!.uid, todayStr)
  );

  // 3. Fetch Current Streak
  const { data: streak, error: streakError } = useSWR(
    user ? `streaks/${user.uid}` : null,
    () => getStreak(user!.uid)
  );

  const isLoading = !profile || !user;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-dust border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Calculate Quran Progress
  const quranPages = todayLog?.quran?.pagesRead || 0;
  const quranTarget = profile?.quranTarget || 2;

  // Calculate Zikr Progress (placeholder logic for now)
  const zikrCompletion = 0; 

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full pb-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
        <GreetingHeader />
        <div className="sm:mt-2">
          <StreakBadge 
            count={streak?.currentStreak || 0} 
            isMilestone={(streak?.currentStreak || 0) % 7 === 0 && (streak?.currentStreak || 0) > 0} 
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Quick Stats Section */}
        <section>
          <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-4">Focus Today</h2>
          <QuickStats 
            quranPages={quranPages} 
            quranTarget={quranTarget} 
            zikrCompletion={zikrCompletion} 
          />
        </section>

        {/* Feature Cards Grid (Placeholders for now) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-8 rounded-3xl bg-white border border-border-warm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-medium font-[family-name:var(--font-lora)] mb-2">Salah Tracker</h3>
            <p className="text-charcoal/60 text-sm mb-6">Stay consistent with your 5 daily prayers.</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-lg bg-charcoal/5 border border-charcoal/5 flex items-center justify-center text-[10px] font-bold text-charcoal/30">
                  {i}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border-warm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-medium font-[family-name:var(--font-lora)] mb-2">Daily Zikr</h3>
            <p className="text-charcoal/60 text-sm mb-6">Morning and evening remembrances.</p>
            <div className="h-2 w-full bg-charcoal/5 rounded-full overflow-hidden">
              <div className="h-full bg-teal-dust w-0 transition-all duration-1000"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
