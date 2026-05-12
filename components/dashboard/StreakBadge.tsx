'use client';

import React from 'react';
import { Fire } from '@phosphor-icons/react';

interface StreakBadgeProps {
  count: number;
  isMilestone?: boolean;
}

export function StreakBadge({ count, isMilestone = false }: StreakBadgeProps) {
  return (
    <div className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
      isMilestone 
        ? 'bg-teal-dust text-white border-teal-dust shadow-md scale-105' 
        : 'bg-white text-charcoal border-border-warm'
    }`}>
      {isMilestone && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
      
      <Fire weight={count > 0 ? 'fill' : 'regular'} className={`w-5 h-5 ${
        isMilestone ? 'text-white' : count > 0 ? 'text-teal-dust' : 'text-charcoal/30'
      }`} />
      
      <span className="text-sm font-semibold tracking-tight">
        {count} Day Streak
      </span>
      
      {isMilestone && (
        <span className="text-[10px] uppercase tracking-widest font-bold ml-1 opacity-80">
          Milestone
        </span>
      )}
    </div>
  );
}
