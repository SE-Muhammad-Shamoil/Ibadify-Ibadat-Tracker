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
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pt-4 px-4 md:px-0 pb-[100px]">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-[var(--text-muted)] mt-1 font-medium">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>👤</span> Profile
        </h2>
        {profile?.avatar_url && (
          <div className="flex items-center gap-5 mb-8 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-sm">
            <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[var(--accent)] shadow-md" />
            <div>
              <div className="font-extrabold text-lg text-[var(--text-primary)] tracking-tight">{profile.full_name}</div>
              <div className="text-[14px] font-medium text-[var(--text-muted)] mt-0.5">{profile.email}</div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-bold uppercase tracking-wider mb-2 block text-[var(--text-secondary)]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl px-5 py-4 text-[16px] font-bold outline-none transition-all focus:border-[var(--accent)]"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-extrabold text-[16px] transition-all active:scale-95 shadow-md text-white border-none mt-4"
            style={{
              background: saved
                ? 'var(--green)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              boxShadow: saved ? '0 4px 15px rgba(48,209,88,0.3)' : '0 4px 15px rgba(94,92,230,0.3)',
            }}
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* About */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
            <span>ℹ️</span> App Info
          </h2>
          <div className="space-y-4 text-[14px] font-bold text-[var(--text-secondary)]">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Version</span>
              <span className="text-[var(--text-primary)] bg-[var(--surface-2)] border border-[var(--border)] px-2 py-1 rounded-md">2.0 Mobile</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Backend</span>
              <span className="text-[var(--text-primary)]">Supabase</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <span>Framework</span>
              <span className="text-[var(--text-primary)]">Next.js 16</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Data Privacy</span>
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider text-[10px]">
                100% Private
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 h-full border border-[var(--red)] bg-red-500/5">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-[var(--red)] tracking-tight">
              <span>⚠️</span> Account
            </h2>
            <p className="text-[14px] font-medium text-[var(--text-muted)] mb-auto pb-6">
              You are currently logged in. Signing out will require you to authenticate again to access your private dashboard.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full py-4 rounded-2xl font-extrabold text-[16px] transition-all active:scale-95 bg-transparent text-[var(--red)] border-2 border-[var(--red)] border-opacity-30 hover:bg-[var(--red)] hover:text-white hover:border-transparent"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
