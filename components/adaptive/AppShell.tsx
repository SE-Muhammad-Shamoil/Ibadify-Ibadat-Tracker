'use client';

import React from 'react';
import { useAdaptive } from '@/lib/hooks/useAdaptive';
import { MobileShell } from './MobileShell';
import { DesktopShell } from './DesktopShell';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isMobile, mounted } = useAdaptive();

  // Don't render shell until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-dust border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileShell>{children}</MobileShell>;
  }

  return <DesktopShell>{children}</DesktopShell>;
}
