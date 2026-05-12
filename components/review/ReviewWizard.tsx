'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smiley, SmileySad, SmileyBlank, Check, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { upsertDailyLog, getDailyLog, getStreak, updateStreak, getUserProfile } from '@/lib/firebase/firestore';
import { calculateNewStreak } from '@/lib/utils/streaks';

interface ReviewData {
  mood?: string;
  reflection?: string;
  gratitude?: string;
  intention?: string;
  completedAt?: any;
}

interface ReviewWizardProps {
  userId: string;
  dateStr: string;
  onComplete?: () => void;
}

const STEPS = ['Gratitude', 'Reflection', 'Intention'];

export function ReviewWizard({ userId, dateStr, onComplete }: ReviewWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ReviewData>({});

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // 1. Save review data
      const finalData = { ...data, completedAt: new Date().toISOString() };
      await upsertDailyLog(userId, dateStr, { nightlyReview: finalData });

      // 2. Update Streak
      try {
        const [log, streakData, profile] = await Promise.all([
          getDailyLog(userId, dateStr),
          getStreak(userId),
          getUserProfile(userId)
        ]);

        if (streakData && profile) {
          const prayers = log?.prayers || {};
          const isPerfect = Object.values(prayers).filter((p: any) => p?.fard).length === 5;
          
          const updatedStreak = calculateNewStreak(
            streakData as any,
            dateStr,
            isPerfect,
            profile.streakGraceEnabled
          );

          await updateStreak(userId, updatedStreak);
        }
      } catch (err) {
        console.error('Streak update failed:', err);
      }

      onComplete?.();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-medium font-[family-name:var(--font-lora)] text-charcoal">How was your day?</h3>
              <p className="text-charcoal/50">Start your review with gratitude.</p>
            </div>
            
            <div className="flex justify-center gap-4 py-4">
              {['😔', 'neutral', '😊', '✨'].map((m, i) => (
                <button
                  key={m}
                  onClick={() => setData({ ...data, mood: m })}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                    data.mood === m ? 'bg-teal-dust text-white scale-110 shadow-lg' : 'bg-charcoal/5 hover:bg-charcoal/10'
                  }`}
                >
                  {m === 'neutral' ? <SmileyBlank /> : m}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal/30 uppercase tracking-widest ml-1">One thing you're grateful for:</label>
              <textarea
                value={data.gratitude || ''}
                onChange={(e) => setData({ ...data, gratitude: e.target.value })}
                placeholder="Alhamdulillah for..."
                className="w-full p-4 rounded-2xl bg-charcoal/5 border-none focus:ring-2 focus:ring-teal-dust/20 min-h-[100px] text-charcoal resize-none"
              />
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-medium font-[family-name:var(--font-lora)] text-charcoal">Self Reflection</h3>
              <p className="text-charcoal/50">A moment of Muhasabah.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal/30 uppercase tracking-widest ml-1">What went well today? What could be better?</label>
              <textarea
                value={data.reflection || ''}
                onChange={(e) => setData({ ...data, reflection: e.target.value })}
                placeholder="Today I felt..."
                className="w-full p-4 rounded-2xl bg-charcoal/5 border-none focus:ring-2 focus:ring-teal-dust/20 min-h-[150px] text-charcoal resize-none"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-medium font-[family-name:var(--font-lora)] text-charcoal">Tomorrow's Intention</h3>
              <p className="text-charcoal/50">Set your heart for the next day.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal/30 uppercase tracking-widest ml-1">My intention for tomorrow is:</label>
              <textarea
                value={data.intention || ''}
                onChange={(e) => setData({ ...data, intention: e.target.value })}
                placeholder="InshaAllah, tomorrow I will..."
                className="w-full p-4 rounded-2xl bg-charcoal/5 border-none focus:ring-2 focus:ring-teal-dust/20 min-h-[120px] text-charcoal resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-teal-dust/5 border border-teal-dust/10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-dust/10 flex items-center justify-center text-teal-dust shrink-0">
                <Heart weight="fill" className="w-4 h-4" />
              </div>
              <p className="text-sm text-charcoal/60 italic leading-relaxed">
                "Actions are judged by intentions." — Hadith
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-[40px] border border-border-warm shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col gap-2">
            <div className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-teal-dust' : 'bg-charcoal/5'}`} />
            <span className={`text-[10px] uppercase tracking-widest font-bold text-center ${i === step ? 'text-teal-dust' : 'text-charcoal/20'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            step === 0 ? 'opacity-0 pointer-events-none' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <ArrowLeft weight="bold" />
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 bg-teal-dust text-white rounded-2xl font-semibold shadow-lg shadow-teal-dust/20 hover:bg-teal-dust/90 active:scale-95 transition-all"
        >
          {step === STEPS.length - 1 ? 'Complete Review' : 'Continue'}
          {step === STEPS.length - 1 ? <Check weight="bold" /> : <ArrowRight weight="bold" />}
        </button>
      </div>
    </div>
  );
}
