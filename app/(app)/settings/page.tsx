'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { signOut } from '@/lib/firebase/auth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-headline-md">Settings</h1>
      
      <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-sm">
        <h2 className="text-title-lg mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-dust/20 flex items-center justify-center text-teal-dust text-2xl font-medium">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <p className="font-medium text-lg">{user?.displayName}</p>
            <p className="text-charcoal/60">{user?.email}</p>
          </div>
        </div>

        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border-warm shadow-sm">
        <h2 className="text-title-lg mb-4">Preferences</h2>
        <p className="text-charcoal/70">Settings form will go here.</p>
      </div>
    </div>
  );
}
