'use client';

import React from 'react';
import { PrayerRow } from './PrayerRow';
import { upsertDailyLog } from '@/lib/firebase/firestore';

interface PrayerData {
  fard: boolean;
  sunnah: number;
}

interface PrayerListProps {
  userId: string;
  dateStr: string;
  initialPrayers?: Record<string, PrayerData>;
}

const PRAYERS = [
  { id: 'fajr', name: 'Fajr', sunnah: 2 },
  { id: 'dhuhr', name: 'Dhuhr', sunnah: 6 }, // 4 before, 2 after
  { id: 'asr', name: 'Asr', sunnah: 0 },
  { id: 'maghrib', name: 'Maghrib', sunnah: 2 },
  { id: 'isha', name: 'Isha', sunnah: 5 }, // 2 sunnah + 3 witr
];

export function PrayerList({ userId, dateStr, initialPrayers = {} }: PrayerListProps) {
  const [prayers, setPrayers] = React.useState<Record<string, PrayerData>>(initialPrayers);

  const handleToggleFard = async (prayerId: string) => {
    const current = prayers[prayerId] || { fard: false, sunnah: 0 };
    const updated = { ...current, fard: !current.fard };
    
    // Optimistic Update
    const newPrayers = { ...prayers, [prayerId]: updated };
    setPrayers(newPrayers);

    try {
      await upsertDailyLog(userId, dateStr, { prayers: newPrayers });
    } catch (error) {
      console.error('Failed to update prayer:', error);
      // Revert on error
      setPrayers(prayers);
    }
  };

  const handleToggleSunnah = async (prayerId: string, index: number) => {
    const current = prayers[prayerId] || { fard: false, sunnah: 0 };
    // Simple logic: if click index X, and current is X, then dec, else set to index + 1
    const newSunnah = index + 1 === current.sunnah ? index : index + 1;
    const updated = { ...current, sunnah: newSunnah };

    // Optimistic Update
    const newPrayers = { ...prayers, [prayerId]: updated };
    setPrayers(newPrayers);

    try {
      await upsertDailyLog(userId, dateStr, { prayers: newPrayers });
    } catch (error) {
      console.error('Failed to update sunnah:', error);
      setPrayers(prayers);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl">
      {PRAYERS.map((p) => (
        <PrayerRow
          key={p.id}
          name={p.name}
          isCompleted={prayers[p.id]?.fard || false}
          onToggle={() => handleToggleFard(p.id)}
          sunnahCount={p.sunnah}
          sunnahCompleted={prayers[p.id]?.sunnah || 0}
          onSunnahToggle={(idx) => handleToggleSunnah(p.id, idx)}
        />
      ))}
    </div>
  );
}
