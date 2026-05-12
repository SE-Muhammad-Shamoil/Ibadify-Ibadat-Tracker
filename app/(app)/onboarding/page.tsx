'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Compass, Moon, Sparkle, Target } from '@phosphor-icons/react';
import { useAuth } from '@/lib/context/AuthContext';
import { updateUserProfile } from '@/lib/firebase/firestore';

const STEPS = [
  {
    title: "Peace, be upon you",
    description: "Welcome to Ibadify. A sacred space designed to help you nurture your spiritual habits with mindfulness and consistency.",
    icon: Sparkle,
    color: "bg-teal-dust/5",
    iconColor: "text-teal-dust"
  },
  {
    title: "Focus on Quality",
    description: "We don't just track numbers. Ibadify encourages meaningful reflection through nightly reviews and intentional zikr.",
    icon: Moon,
    color: "bg-charcoal/5",
    iconColor: "text-charcoal"
  },
  {
    title: "Your Journey, Your Pace",
    description: "Whether you're managing Qaza prayers or aiming for a new Quran goal, we're here to support your unique spiritual path.",
    icon: Compass,
    color: "bg-teal-dust/5",
    iconColor: "text-teal-dust"
  },
  {
    title: "Daily Goal",
    description: "How many pages of the Quran would you like to read daily? (Default: 2 pages)",
    icon: Target,
    type: "input",
    field: "quranTarget"
  }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ quranTarget: 2 });
  const { user } = useAuth();
  const router = useRouter();

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      if (user) {
        await updateUserProfile(user.uid, {
          onboardingComplete: true,
          quranTarget: Number(formData.quranTarget),
          homeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          madhab: 'hanafi' // default
        });
        router.push('/dashboard');
      }
    }
  };

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-charcoal">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-8"
          >
            <div className={`w-24 h-24 ${currentStep.color || 'bg-teal-dust/5'} rounded-[32px] mx-auto flex items-center justify-center`}>
              <Icon weight="duotone" className={`w-12 h-12 ${currentStep.iconColor || 'text-teal-dust'}`} />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-medium font-[family-name:var(--font-lora)]">{currentStep.title}</h1>
              <p className="text-charcoal/60 leading-relaxed">{currentStep.description}</p>
            </div>

            {currentStep.type === "input" && (
              <div className="flex justify-center gap-4">
                {[1, 2, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData({ ...formData, quranTarget: num })}
                    className={`w-12 h-12 rounded-2xl border-2 transition-all ${
                      formData.quranTarget === num 
                        ? 'border-teal-dust bg-teal-dust/5 text-teal-dust font-bold' 
                        : 'border-border-warm bg-white text-charcoal/40'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex flex-col items-center gap-6">
          <button
            onClick={handleNext}
            className="w-full py-5 bg-charcoal text-white rounded-[24px] font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2"
          >
            {step === STEPS.length - 1 ? 'Start My Journey' : 'Continue'}
            <ArrowRight weight="bold" className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === step ? 'w-8 bg-teal-dust' : 'w-2 bg-charcoal/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
