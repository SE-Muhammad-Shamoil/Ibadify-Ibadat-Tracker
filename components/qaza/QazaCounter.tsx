'use client';

import React from 'react';
import { Minus, Plus, Calendar } from '@phosphor-icons/react';
import { updateQazaDebt } from '@/lib/firebase/firestore';

interface QazaPrayerData {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
}

interface QazaCounterProps {
  userId: string;
  estimatedDebt: QazaPrayerData;
  paidOff: QazaPrayerData;
  onUpdate: (type: 'estimatedDebt' | 'paidOff', data: QazaPrayerData) => void;
}

const PRAYERS: (keyof QazaPrayerData)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];

export function QazaCounter({ userId, estimatedDebt, paidOff, onUpdate }: QazaCounterProps) {
  
  const handleAdjust = async (prayer: keyof QazaPrayerData, amount: number, type: 'estimatedDebt' | 'paidOff') => {
    const current = type === 'estimatedDebt' ? estimatedDebt : paidOff;
    const newVal = Math.max(0, current[prayer] + amount);
    const newData = { ...current, [prayer]: newVal };
    
    onUpdate(type, newData);
    
    try {
      await updateQazaDebt(userId, { [type]: newData });
    } catch (err) {
      console.error('Failed to update qaza:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {PRAYERS.map((p) => {
        const debt = estimatedDebt[p];
        const paid = paidOff[p];
        const remaining = Math.max(0, debt - paid);
        const progress = debt > 0 ? (paid / debt) * 100 : 0;

        return (
          <div key={p} className="bg-white p-6 rounded-3xl border border-border-warm shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium capitalize text-charcoal">{p}</h3>
              <div className="px-2 py-1 bg-teal-dust/10 rounded-lg text-[10px] font-bold text-teal-dust uppercase tracking-widest">
                {remaining} Remaining
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">Paid Off</span>
                <div className="flex items-center bg-charcoal/5 rounded-xl p-1">
                  <button 
                    onClick={() => handleAdjust(p, -1, 'paidOff')}
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Minus weight="bold" />
                  </button>
                  <span className="w-10 text-center font-bold text-charcoal">{paid}</span>
                  <button 
                    onClick={() => handleAdjust(p, 1, 'paidOff')}
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Plus weight="bold" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">Total Debt</span>
                <div className="flex items-center bg-charcoal/5 rounded-xl p-1">
                  <button 
                    onClick={() => handleAdjust(p, -1, 'estimatedDebt')}
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Minus weight="bold" />
                  </button>
                  <span className="w-10 text-center font-bold text-charcoal">{debt}</span>
                  <button 
                    onClick={() => handleAdjust(p, 1, 'estimatedDebt')}
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Plus weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full bg-charcoal/5 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-teal-dust transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
