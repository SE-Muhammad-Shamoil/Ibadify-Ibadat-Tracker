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
    <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>👤</span> Profile
        </h2>
        {profile?.avatar_url && (
          <div className="flex items-center gap-4 mb-5">
            <img src={profile.avatar_url} alt="Avatar" className="w-14 h-14 rounded-2xl" />
            <div>
              <div className="font-medium" style={{ color: '#e2e8f0' }}>{profile.full_name}</div>
              <div className="text-sm" style={{ color: '#64748b' }}>{profile.email}</div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#94a3b8' }}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#f1f5f9',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            }}
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>ℹ️</span> About
        </h2>
        <div className="space-y-3 text-sm" style={{ color: '#94a3b8' }}>
          <div className="flex justify-between">
            <span>Version</span>
            <span style={{ color: '#e2e8f0' }}>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Backend</span>
            <span style={{ color: '#e2e8f0' }}>Supabase</span>
          </div>
          <div className="flex justify-between">
            <span>Framework</span>
            <span style={{ color: '#e2e8f0' }}>Next.js 16</span>
          </div>
          <div className="flex justify-between">
            <span>Data Privacy</span>
            <span style={{ color: '#34d399' }}>100% Private ✓</span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
          <span>⚠️</span> Account
        </h2>
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
