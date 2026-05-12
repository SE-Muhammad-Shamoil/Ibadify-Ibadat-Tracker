'use client';

import React, { useEffect, useState } from 'react';
import { DownloadSimple, X } from '@phosphor-icons/react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show after some usage or session duration
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-charcoal text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <DownloadSimple weight="bold" className="text-teal-dust" />
          </div>
          <div>
            <p className="text-sm font-semibold">Install Ibadify</p>
            <p className="text-xs text-white/60">Add to your home screen for quick access.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstall}
            className="px-4 py-2 bg-teal-dust text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Install
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-white/30 hover:text-white transition-colors"
          >
            <X weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
