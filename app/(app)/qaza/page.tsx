'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import { getQazaDebt } from '@/lib/firebase/firestore';
import { QazaCounter } from '@/components/qaza/QazaCounter';
import { ClockCounterClockwise, Info } from '@phosphor-icons/react';

export default function QazaPage() {
  const { user } = useAuth();
  
  const { data: qaza, isLoading, mutate } = useSWR(
    user ? `qaza/${user.uid}` : null,
    () => getQazaDebt(user!.uid)
  );

  const [localQaza, setLocalQaza] = useState<any>(null);

  useEffect(() => {
    if (qaza) setLocalQaza(qaza);
  }, [qaza]);

  if (isLoading || !user || !localQaza) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-dust border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const handleUpdate = (type: string, data: any) => {
    setLocalQaza((prev: any) => ({ ...prev, [type]: data }));
  };

  const totalRemaining = Object.keys(localQaza.estimatedDebt).reduce((acc, key) => {
    return acc + Math.max(0, localQaza.estimatedDebt[key] - localQaza.paidOff[key]);
  }, 0);

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal mb-2">
            Qaza Manager
          </h1>
          <p className="text-charcoal/60 text-[15px]">
            Keep track of your missed prayers and fulfill your debts.
          </p>
        </div>
        
        <div className="bg-white px-6 py-4 rounded-2xl border border-border-warm shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-dust/10 flex items-center justify-center text-teal-dust">
            <ClockCounterClockwise weight="bold" className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">Total Remaining</p>
            <p className="text-xl font-bold text-charcoal">{totalRemaining} Prayers</p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Prayers</h2>
            <div className="flex-1 h-[1px] bg-border-warm"></div>
          </div>
          <QazaCounter 
            userId={user.uid} 
            estimatedDebt={localQaza.estimatedDebt} 
            paidOff={localQaza.paidOff} 
            onUpdate={handleUpdate}
          />
        </section>

        <section className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
          <Info weight="fill" className="text-amber-500 w-6 h-6 mt-1" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-900">Spiritual Tip</h4>
            <p className="text-sm text-amber-800/70 leading-relaxed">
              Try to pray one Qaza prayer with every Fard prayer you perform. Consistency is more beloved to Allah than intensity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
