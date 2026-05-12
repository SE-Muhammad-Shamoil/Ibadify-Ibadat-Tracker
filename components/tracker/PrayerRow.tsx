'use client';

import React, { useState } from 'react';
import { CaretDown, CaretUp, Check } from '@phosphor-icons/react';

interface PrayerRowProps {
  name: string;
  isCompleted: boolean;
  onToggle: () => void;
  sunnahCount?: number;
  sunnahCompleted?: number;
  onSunnahToggle?: (index: number) => void;
}

export function PrayerRow({ 
  name, 
  isCompleted, 
  onToggle, 
  sunnahCount = 0, 
  sunnahCompleted = 0,
  onSunnahToggle 
}: PrayerRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
          isCompleted 
            ? 'bg-teal-dust/5 border-teal-dust/20 shadow-sm' 
            : 'bg-white border-border-warm hover:border-teal-dust/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
              isCompleted 
                ? 'bg-teal-dust border-teal-dust text-white scale-110' 
                : 'border-border-warm hover:border-teal-dust/50'
            }`}
          >
            {isCompleted && <Check weight="bold" className="w-4 h-4" />}
          </button>
          
          <span className={`text-lg font-medium tracking-tight ${isCompleted ? 'text-charcoal' : 'text-charcoal/80'}`}>
            {name}
          </span>
        </div>

        {sunnahCount > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-charcoal/30 hover:text-charcoal/60 transition-colors"
          >
            {isExpanded ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
          </button>
        )}
      </div>

      {/* Expanded Sunnah Section */}
      {isExpanded && sunnahCount > 0 && (
        <div className="mx-6 px-6 py-4 border-l border-border-warm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[11px] font-bold text-charcoal/30 uppercase tracking-widest mb-1">Sunnah / Nawafil</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: sunnahCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => onSunnahToggle?.(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  i < sunnahCompleted
                    ? 'bg-teal-dust/10 border-teal-dust/30 text-teal-dust'
                    : 'bg-white border-border-warm text-charcoal/40 hover:border-teal-dust/20'
                }`}
              >
                {name === 'Isha' && i === sunnahCount - 1 ? 'Witr' : `Rakat ${i + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
