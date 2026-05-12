'use client';

import React from 'react';
import { BookOpen, Checks } from '@phosphor-icons/react';

interface QuickStatsProps {
  quranPages: number;
  quranTarget: number;
  zikrCompletion: number; // Percentage 0-100
}

export function QuickStats({ quranPages, quranTarget, zikrCompletion }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Quran Stat */}
      <div className="bg-white p-5 rounded-2xl border border-border-warm shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-dust/10 flex items-center justify-center text-teal-dust">
          <BookOpen weight="duotone" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[13px] text-charcoal/50 font-medium uppercase tracking-wider">Quran Today</p>
          <p className="text-xl font-semibold text-charcoal">
            {quranPages} <span className="text-sm font-normal text-charcoal/40">/ {quranTarget} pages</span>
          </p>
        </div>
      </div>

      {/* Zikr Stat */}
      <div className="bg-white p-5 rounded-2xl border border-border-warm shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/60">
          <Checks weight="duotone" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[13px] text-charcoal/50 font-medium uppercase tracking-wider">Zikr Progress</p>
          <p className="text-xl font-semibold text-charcoal">
            {zikrCompletion}% <span className="text-sm font-normal text-charcoal/40">completed</span>
          </p>
        </div>
      </div>
    </div>
  );
}
