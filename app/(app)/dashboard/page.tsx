'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { signOut } from '@/lib/firebase/auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-headline-md mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.displayName || user?.email}</p>
      <button 
        onClick={() => signOut()}
        className="px-4 py-2 bg-charcoal text-white rounded"
      >
        Sign out
      </button>
    </div>
  );
}
