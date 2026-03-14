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
          isActive 
            ? 'glass-panel glow-accent text-[var(--accent-light)]' 
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
        }`}
      >
        <span className="text-lg">{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕌</span>
          <span className="font-bold gradient-text">Ibadah Tracker</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 flex flex-col glass
        md:sticky md:top-0 md:z-auto
        transition-transform duration-300 border-r border-[var(--border)]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)]">
          <span className="text-2xl">🕌</span>
          <div>
            <div className="font-bold gradient-text tracking-wide">Ibadah Tracker</div>
            <div className="text-xs text-[var(--text-muted)]">Your spiritual journey</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-[var(--border)]">
          {profile && (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-10 h-10 rounded-full border border-[var(--border)]" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white shadow-inner">
                  {profile.full_name?.[0] || profile.email?.[0] || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                  {profile.full_name || 'User'}
                </div>
                <div className="text-xs truncate text-[var(--text-muted)]">{profile.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10 text-[var(--red)] border border-transparent hover:border-red-500/20"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
