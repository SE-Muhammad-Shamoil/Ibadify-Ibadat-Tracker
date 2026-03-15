'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Moon, Clock, BookOpen, Flame, Award, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex flex-col relative bg-[var(--background)]">
      {/* Premium Dark Background with Image Overlay */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[var(--background)] z-10" />
        <div 
          className="absolute inset-0 z-20 opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)] to-[var(--background)] z-30" />
      </div>

      {/* Nav */}
      <nav className="relative z-40 flex items-center justify-between px-6 py-5 border-b border-white/[0.05] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-[var(--border)] shadow-sm overflow-hidden flex items-center justify-center bg-white">
            <img src="/logo.png" alt="Ibadify Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Ibadify</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="px-5 py-2 rounded-xl font-semibold text-sm transition-all text-zinc-900 bg-zinc-100 hover:bg-white hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-40 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="animate-fadeIn max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-light)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Private • Personal • Reflective
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-[var(--text-primary)]">
            Track Your <br className="hidden md:block" />
            <span className="text-[var(--text-secondary)]">Daily Ibadah</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[var(--text-muted)] font-medium leading-relaxed">
            Log prayers, Quran recitation, zikr, and good deeds. Build streaks, earn badges,
            and visualize your spiritual journey privately.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[16px] font-semibold transition-all text-zinc-900 bg-zinc-100 hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] w-full sm:w-auto"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <ArrowRight className="w-5 h-5 ml-1 opacity-50" />
          </button>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-5xl w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: Clock, title: '5 Daily Prayers', desc: 'Track each salah strictly' },
            { icon: BookOpen, title: "Qur'an Reading", desc: 'Log pages & minutes' },
            { icon: Flame, title: 'Streak Tracking', desc: 'Build consistent habits' },
            { icon: Award, title: 'Achievements', desc: 'Celebrate milestones' },
          ].map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="glass-panel p-6 rounded-3xl text-left border border-white/5 transition-colors hover:bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-5 shadow-sm">
                  <Icon className="w-6 h-6 text-[var(--accent-light)]" />
                </div>
                <div className="font-semibold text-[16px] text-[var(--text-primary)] mb-1.5">{f.title}</div>
                <div className="text-[14px] text-[var(--text-muted)] leading-relaxed">{f.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-40 text-center py-8 text-[13px] text-[var(--text-muted)] border-t border-white/[0.02]">
        <p>Ibadify — Built for spiritual growth.</p>
      </footer>
    </main>
  )
}
