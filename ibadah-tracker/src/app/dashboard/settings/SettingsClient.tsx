'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile | null
  userId: string
}

export default function SettingsClient({ profile, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').upsert({ id: userId, full_name: name })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pt-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>👤</span> Profile
        </h2>
        {profile?.avatar_url && (
          <div className="flex items-center gap-5 mb-8 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-sm">
            <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[var(--accent-glow)] shadow-md" />
            <div>
              <div className="font-semibold text-lg text-[var(--text-primary)]">{profile.full_name}</div>
              <div className="text-sm text-[var(--text-muted)] mt-0.5">{profile.email}</div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-[var(--text-secondary)]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all shadow-inner focus:ring-2 ring-[var(--accent-glow)]"
              style={{
                background: 'var(--surface-[2])',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg active:scale-95 text-white"
            style={{
              background: saved
                ? 'linear-gradient(135deg, var(--green), var(--green-light))'
                : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              boxShadow: saved ? '0 4px 15px rgba(16,185,129,0.3)' : '0 4px 15px rgba(139,92,246,0.3)',
            }}
          >
            {saved ? '✓ Saved Successfully!' : saving ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pb-12">
        {/* About */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 h-full">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
            <span>ℹ️</span> App Info
          </h2>
          <div className="space-y-4 text-sm font-medium text-[var(--text-secondary)]">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Version</span>
              <span className="text-[var(--text-primary)] font-semibold bg-[var(--surface-2)] px-2 py-1 rounded-md">1.0.0</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Backend</span>
              <span className="text-[var(--text-primary)] font-semibold">Supabase</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Framework</span>
              <span className="text-[var(--text-primary)] font-semibold">Next.js 16</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Data Privacy</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center gap-1 font-bold">
                100% Private ✓
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 h-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
          <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-400">
              <span>⚠️</span> Account Setup
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-auto pb-6">
              You are currently logged in. Signing out will require you to authenticate again to access your private dashboard.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
            >
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
