'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserProfile, getDailyLog } from '@/lib/firebase/firestore';
import { getTodayStringInTimezone } from '@/lib/utils/timezone';
import { PrayerList } from '@/components/tracker/PrayerList';
import { NawafilSection } from '@/components/tracker/NawafilSection';
import { QuranTracker } from '@/components/tracker/QuranTracker';
import { ZikrTracker } from '@/components/tracker/ZikrTracker';

export default function TrackerPage() {
  const { user } = useAuth();

  const { data: profile } = useSWR(
    user ? `users/${user.uid}` : null,
    () => getUserProfile(user!.uid)
  );

  const timezone = profile?.homeTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const todayStr = useMemo(() => getTodayStringInTimezone(timezone), [timezone]);

  const { data: todayLog, isLoading } = useSWR(
    user ? `logs/${user.uid}/${todayStr}` : null,
    () => getDailyLog(user!.uid, todayStr)
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
      <div className="mb-10">
        <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal mb-2">
          Daily Tracker
        </h1>
        <p className="text-charcoal/60 text-[15px]">
          Track your spiritual habits for {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-12">
        {/* Prayers Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Prayers</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <PrayerList 
            userId={user.uid} 
            dateStr={todayStr} 
            initialPrayers={todayLog?.prayers} 
          />
        </section>
        
        {/* Nawafil Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Sunnah Mu'akkadah</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <NawafilSection 
            userId={user.uid} 
            dateStr={todayStr} 
            initialData={todayLog?.nawafil} 
          />
        </section>

        {/* Quran Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Quran</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <QuranTracker 
            userId={user.uid} 
            dateStr={todayStr} 
            target={profile?.quranTarget || 2} 
            initialData={todayLog?.quran} 
          />
        </section>

        {/* Zikr Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Zikr</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <ZikrTracker 
            userId={user.uid} 
            dateStr={todayStr} 
            initialData={todayLog?.zikr} 
          />
        </section>
      </div>
    </div>
  );
}
