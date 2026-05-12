'use client';

import React from 'react';
import { Minus, Plus, BookOpen } from '@phosphor-icons/react';
import { upsertDailyLog } from '@/lib/firebase/firestore';

interface QuranData {
  pagesRead: number;
  lastSurah?: string;
  isCompleted: boolean;
}

interface QuranTrackerProps {
  userId: string;
  dateStr: string;
  target: number;
  initialData?: QuranData;
}

export function QuranTracker({ userId, dateStr, target, initialData }: QuranTrackerProps) {
  const [data, setData] = React.useState<QuranData>(initialData || {
    pagesRead: 0,
    isCompleted: false,
  });

  const updateFirestore = async (newData: QuranData) => {
    try {
      await upsertDailyLog(userId, dateStr, { quran: newData });
    } catch (error) {
      console.error('Failed to update Quran log:', error);
    }
  };

  const handleIncrement = () => {
    const newData = { ...data, pagesRead: data.pagesRead + 1 };
    if (newData.pagesRead >= target) newData.isCompleted = true;
    setData(newData);
    updateFirestore(newData);
  };

  const handleDecrement = () => {
    if (data.pagesRead <= 0) return;
    const newData = { ...data, pagesRead: data.pagesRead - 1 };
    if (newData.pagesRead < target) newData.isCompleted = false;
    setData(newData);
    updateFirestore(newData);
  };

  const progress = Math.min((data.pagesRead / target) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-3xl border border-border-warm shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-dust/10 flex items-center justify-center text-teal-dust">
            <BookOpen weight="duotone" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-charcoal">Daily Recitation</h3>
            <p className="text-sm text-charcoal/40">Target: {target} pages</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-charcoal/5 rounded-2xl p-1">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <Minus weight="bold" />
            </button>
            <span className="w-12 text-center text-xl font-semibold text-charcoal">
              {data.pagesRead}
            </span>
            <button 
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <Plus weight="bold" />
            </button>
          </div>

          <div className="hidden sm:block h-10 w-[1px] bg-border-warm"></div>

          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-teal-dust uppercase tracking-wider">
              {Math.round(progress)}%
            </span>
            <span className="text-[10px] text-charcoal/30 font-medium uppercase tracking-widest">Progress</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 h-2 w-full bg-charcoal/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-teal-dust transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
