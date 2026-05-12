'use client';

import React from 'react';
import { Check } from '@phosphor-icons/react';
import { upsertDailyLog } from '@/lib/firebase/firestore';

interface NawafilData {
  tahajjud: boolean;
  ishraq: boolean;
  chasht: boolean;
  awwabin: boolean;
}

interface NawafilSectionProps {
  userId: string;
  dateStr: string;
  initialData?: NawafilData;
}

const EXTRA_PRAYERS = [
  { id: 'tahajjud', name: 'Tahajjud' },
  { id: 'ishraq', name: 'Ishraq' },
  { id: 'chasht', name: 'Chasht' },
  { id: 'awwabin', name: 'Awwabin' },
];

export function NawafilSection({ userId, dateStr, initialData }: NawafilSectionProps) {
  const [data, setData] = React.useState<NawafilData>(initialData || {
    tahajjud: false,
    ishraq: false,
    chasht: false,
    awwabin: false,
  });

  const handleToggle = async (id: keyof NawafilData) => {
    const updated = { ...data, [id]: !data[id] };
    setData(updated);

    try {
      await upsertDailyLog(userId, dateStr, { nawafil: updated });
    } catch (error) {
      console.error('Failed to update nawafil:', error);
      setData(data);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {EXTRA_PRAYERS.map((p) => {
        const isChecked = data[p.id as keyof NawafilData];
        return (
          <button
            key={p.id}
            onClick={() => handleToggle(p.id as keyof NawafilData)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
              isChecked 
                ? 'bg-teal-dust/5 border-teal-dust/30 text-teal-dust' 
                : 'bg-white border-border-warm text-charcoal/40 hover:border-teal-dust/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              isChecked ? 'bg-teal-dust border-teal-dust text-white' : 'border-border-warm'
            }`}>
              {isChecked && <Check weight="bold" className="w-3 h-3" />}
            </div>
            <span className="text-xs font-medium uppercase tracking-wider">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
