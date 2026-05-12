'use client';

import React, { useState } from 'react';
import { Sun, Moon, Fingerprint, Refresh } from '@phosphor-icons/react';
import { upsertDailyLog } from '@/lib/firebase/firestore';

interface ZikrData {
  morning: boolean;
  evening: boolean;
  tasbihCount: number;
}

interface ZikrTrackerProps {
  userId: string;
  dateStr: string;
  initialData?: ZikrData;
}

export function ZikrTracker({ userId, dateStr, initialData }: ZikrTrackerProps) {
  const [data, setData] = useState<ZikrData>(initialData || {
    morning: false,
    evening: false,
    tasbihCount: 0,
  });

  const updateFirestore = async (newData: ZikrData) => {
    try {
      await upsertDailyLog(userId, dateStr, { zikr: newData });
    } catch (error) {
      console.error('Failed to update Zikr log:', error);
    }
  };

  const handleToggle = (id: 'morning' | 'evening') => {
    const newData = { ...data, [id]: !data[id] };
    setData(newData);
    updateFirestore(newData);
  };

  const handleTasbih = () => {
    const newData = { ...data, tasbihCount: data.tasbihCount + 1 };
    setData(newData);
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }

    // Update firestore occasionally or on pause? 
    // For now, let's update every 10 counts or so to avoid spamming
    if (newData.tasbihCount % 10 === 0) {
      updateFirestore(newData);
    }
  };

  const resetTasbih = () => {
    const newData = { ...data, tasbihCount: 0 };
    setData(newData);
    updateFirestore(newData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleToggle('morning')}
          className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${
            data.morning 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-white border-border-warm text-charcoal/40 hover:border-amber-100'
          }`}
        >
          <Sun weight={data.morning ? 'fill' : 'regular'} className="w-6 h-6" />
          <span className="font-medium text-sm">Morning Adhkar</span>
        </button>

        <button
          onClick={() => handleToggle('evening')}
          className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${
            data.evening 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
              : 'bg-white border-border-warm text-charcoal/40 hover:border-indigo-100'
          }`}
        >
          <Moon weight={data.evening ? 'fill' : 'regular'} className="w-6 h-6" />
          <span className="font-medium text-sm">Evening Adhkar</span>
        </button>
      </div>

      {/* Tasbih Counter */}
      <div className="bg-white p-6 rounded-3xl border border-border-warm shadow-sm flex flex-col items-center gap-6">
        <div className="flex items-center justify-between w-full mb-2">
          <h3 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-widest">Tasbih Counter</h3>
          <button 
            onClick={resetTasbih}
            className="p-2 text-charcoal/30 hover:text-charcoal/60 transition-colors"
          >
            <Refresh weight="bold" />
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={handleTasbih}
            className="w-32 h-32 rounded-full bg-teal-dust text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-teal-dust/20 active:scale-95 transition-transform"
          >
            <Fingerprint className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-3xl font-bold">{data.tasbihCount}</span>
          </button>
          
          {/* Visual pulse on count? Maybe later */}
        </div>
        
        <p className="text-[11px] text-charcoal/30 font-medium text-center max-w-[180px]">
          Tap anywhere in the circle to increment. Vibration enabled on mobile.
        </p>
      </div>
    </div>
  );
}
