'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserProfile, getDailyLog } from '@/lib/firebase/firestore';
import { getTodayStringInTimezone } from '@/lib/utils/timezone';
import { ReviewWizard } from '@/components/review/ReviewWizard';
import { CheckCircle, MoonStars } from '@phosphor-icons/react';
import Link from 'next/link';

export default function ReviewPage() {
  const { user } = useAuth();
  const [justCompleted, setJustCompleted] = useState(false);

  const { data: profile } = useSWR(
    user ? `users/${user.uid}` : null,
    () => getUserProfile(user!.uid)
  );

  const timezone = profile?.homeTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const todayStr = useMemo(() => getTodayStringInTimezone(timezone), [timezone]);

  const { data: todayLog, mutate } = useSWR(
    user ? `logs/${user.uid}/${todayStr}` : null,
    () => getDailyLog(user!.uid, todayStr)
  );

  const isCompleted = todayLog?.nightlyReview || justCompleted;

  if (!user) return null;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full pb-20 pt-6">
      {!isCompleted ? (
        <>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-teal-dust/10 flex items-center justify-center text-teal-dust mx-auto mb-4">
              <MoonStars weight="duotone" className="w-8 h-8" />
            </div>
            <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal mb-2">
              Nightly Review
            </h1>
            <p className="text-charcoal/60 text-[15px] max-w-md mx-auto">
              End your day with mindfulness and gratitude. Reflect on your spiritual progress.
            </p>
          </div>

          <ReviewWizard 
            userId={user.uid} 
            dateStr={todayStr} 
            onComplete={() => {
              setJustCompleted(true);
              mutate();
            }}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 rounded-full bg-teal-dust flex items-center justify-center text-white mb-8 shadow-xl shadow-teal-dust/20">
            <CheckCircle weight="fill" className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-medium font-[family-name:var(--font-lora)] text-charcoal mb-4">
            Review Complete
          </h2>
          <p className="text-charcoal/50 max-w-sm mb-10 leading-relaxed">
            You've successfully completed your reflection for today. May your heart find peace and your intentions be blessed.
          </p>
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-white border border-border-warm text-charcoal font-semibold rounded-2xl hover:bg-charcoal/5 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
