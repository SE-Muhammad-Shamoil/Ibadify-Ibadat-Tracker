'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { Home, PenTool, BarChart2, Award, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/log', label: 'Daily Log', icon: PenTool },
  { href: '/dashboard/progress', label: 'Progress', icon: BarChart2 },
  { href: '/dashboard/badges', label: 'Badges', icon: Award },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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

  const NavLinkDesktop = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    const Icon = item.icon
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-[15px] font-medium ${
          isActive 
            ? 'bg-[var(--surface-2)] text-[var(--accent-light)]' 
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''}`} />
        <span className={isActive ? 'font-semibold text-[var(--text-primary)]' : ''}>{item.label}</span>
      </Link>
    )
  }

  const NavLinkMobile = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    const Icon = item.icon
    return (
      <Link
        href={item.href}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
          isActive ? 'text-[var(--accent-light)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'opacity-100 text-[var(--text-primary)]' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl flex items-center justify-between px-5 pt-safe pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-8 h-8 rounded-full border border-[var(--border)] shadow-sm overflow-hidden flex items-center justify-center bg-white">
            <img src="/logo.png" alt="Ibadify Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">Ibadify</span>
        </div>
        {profile && (
          <Link href="/dashboard/settings" className="mt-2">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-8 h-8 rounded-full border border-[var(--border)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] border border-[var(--border)]">
                {profile.full_name?.[0] || '?'}
              </div>
            )}
          </Link>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/90 backdrop-blur-2xl border-t border-[var(--border)] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => <NavLinkMobile key={item.href} item={item} />)}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex sticky top-0 h-screen w-72 flex-col bg-[var(--background)] border-r border-[var(--border)]">
        
        {/* Logo */}
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="w-10 h-10 rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex items-center justify-center bg-white">
            <img src="/logo.png" alt="Ibadify Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-exrabold text-xl tracking-tight leading-tight flex items-center gap-2">Ibadify</div>
            <div className="text-[12px] font-medium text-[var(--text-muted)] mt-0.5 tracking-wide uppercase">Spiritual Tracker</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {NAV_ITEMS.map((item) => <NavLinkDesktop key={item.href} item={item} />)}
        </nav>

        {/* User profile */}
        <div className="p-4 mx-4 mb-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
          {profile && (
            <div className="flex items-center gap-3 mb-3 px-2 pt-2">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-10 h-10 rounded-full border border-[var(--border)]" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)]">
                  {profile.full_name?.[0] || profile.email?.[0] || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold truncate text-[var(--text-primary)]">
                  {profile.full_name || 'User'}
                </div>
                <div className="text-[12px] font-medium truncate text-[var(--text-muted)]">{profile.email}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
