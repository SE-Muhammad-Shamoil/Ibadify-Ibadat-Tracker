'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  // OAuth login commented out for UI preview
  const handleGoogleLogin = async () => {
    // await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`,
    //   },
    // })
    // Guest mode: navigate directly to dashboard
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse-glow ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 glass" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕌</span>
          <span className="text-xl font-bold gradient-text">Ibadah Tracker</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="px-5 py-2 rounded-xl font-medium text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span style={{ color: '#a5b4fc' }}>Private • Personal • Reflective</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">Track Your</span>
            <br />
            <span style={{ color: '#f1f5f9' }}>Daily Ibadah</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#94a3b8' }}>
            Log prayers, Quran recitation, zikr, and good deeds. Build streaks, earn badges,
            and visualize your spiritual journey — all privately, just between you and Allah.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.5)',
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: '🕌', title: '5 Daily Prayers', desc: 'Track each salah with status' },
            { icon: '📖', title: "Qur'an Reading", desc: 'Log pages & minutes daily' },
            { icon: '🔥', title: 'Streak Tracking', desc: 'Build consistent habits' },
            { icon: '🏅', title: 'Achievement Badges', desc: 'Celebrate milestones' },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 card-hover text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#e2e8f0' }}>{f.title}</div>
              <div className="text-xs" style={{ color: '#64748b' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-sm" style={{ color: '#475569' }}>
        <p>Ibadah Tracker — Built for self-improvement & spiritual growth 🤲</p>
      </footer>
    </main>
  )
}
