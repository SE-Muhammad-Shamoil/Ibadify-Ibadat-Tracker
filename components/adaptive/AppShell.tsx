'use client';

import React from 'react';
import { useAdaptive } from '@/lib/hooks/useAdaptive';
import { MobileShell } from './MobileShell';
import { DesktopShell } from './DesktopShell';
import useSWR from 'swr';
import { getDailyLog, getUserProfile } from '@/lib/firebase/firestore';
import { getTodayStringInTimezone } from '@/lib/utils/timezone';
import { calculateBarakahScore, getBarakahTint } from '@/lib/utils/barakah';
import { useAuth } from '@/lib/context/AuthContext';
import { InstallPrompt } from '../pwa/InstallPrompt';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isMobile, mounted } = useAdaptive();
  const { user } = useAuth();

  // Fetch data for Barakah tint
  const { data: profile } = useSWR(user ? `users/${user.uid}/profile` : null, () => getUserProfile(user!.uid));
  const tz = profile?.homeTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = getTodayStringInTimezone(tz);
  const { data: log } = useSWR(user ? `logs/${user.uid}/${today}` : null, () => getDailyLog(user!.uid, today));

  React.useEffect(() => {
    if (!mounted) return;

    const prayers = log?.prayers || {};
    const prayersCompleted = Object.values(prayers).filter((p: any) => p?.fard).length;
    
    const score = calculateBarakahScore({
      prayersCompleted,
      sunnahCompleted: 0, // Placeholder
      quranPages: log?.quran?.pagesRead || 0,
      zikrCompleted: false, // Placeholder
      nightlyReviewDone: !!log?.nightlyReview,
    });

    const tint = getBarakahTint(score);
    document.documentElement.style.setProperty('--background', tint);
    document.body.style.backgroundColor = tint;
  }, [log, mounted]);

  // Don't render shell until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-dust border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <MobileShell>{children}</MobileShell>
      ) : (
        <DesktopShell>{children}</DesktopShell>
      )}
      <InstallPrompt />
    </>
  );
}
