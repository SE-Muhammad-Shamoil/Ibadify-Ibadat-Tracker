'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/log', label: 'Daily Log', icon: '📝' },
  { href: '/dashboard/progress', label: 'Progress', icon: '📊' },
  { href: '/dashboard/badges', label: 'Badges', icon: '🏅' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const NavLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
          isActive ? 'glow-accent' : 'hover:bg-white/5'
        }`}
        style={isActive ? {
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(79,70,229,0.2))',
          color: '#a5b4fc',
          border: '1px solid rgba(99,102,241,0.3)',
        } : { color: '#94a3b8' }}
      >
        <span className="text-lg">{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🕌</span>
          <span className="font-bold gradient-text">Ibadah Tracker</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg" style={{ color: '#94a3b8' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 flex flex-col
        md:sticky md:top-0 md:z-auto
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(99,102,241,0.1)' }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <span className="text-2xl">🕌</span>
          <div>
            <div className="font-bold gradient-text">Ibadah Tracker</div>
            <div className="text-xs" style={{ color: '#475569' }}>Your spiritual journey</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>

        {/* User profile */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          {profile && (
            <div className="flex items-center gap-3 mb-3 px-2">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {profile.full_name?.[0] || profile.email?.[0] || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>
                  {profile.full_name || 'User'}
                </div>
                <div className="text-xs truncate" style={{ color: '#64748b' }}>{profile.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:bg-red-500/10"
            style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
