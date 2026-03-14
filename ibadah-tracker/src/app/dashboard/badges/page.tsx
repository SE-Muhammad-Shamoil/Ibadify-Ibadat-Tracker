import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Badge } from '@/lib/types'
import { BADGES_CONFIG } from '@/lib/types'

export default async function BadgesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: earnedBadges } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', user.id)

  const badges = (earnedBadges || []) as Badge[]
  const earnedTypes = new Set(badges.map(b => b.badge_type))

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">Achievements</h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">
          {badges.length} of {BADGES_CONFIG.length} badges earned
        </p>
      </div>

      {/* Progress bar */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-[var(--text-secondary)]">Collection Progress</span>
          <span className="text-lg font-bold text-[var(--accent-light)]">
            {Math.round(badges.length / BADGES_CONFIG.length * 100)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[var(--surface-2)] shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${badges.length / BADGES_CONFIG.length * 100}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
            }}
          >
             <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {BADGES_CONFIG.map((config) => {
          const earned = earnedTypes.has(config.type)
          const badge = badges.find(b => b.badge_type === config.type)
          return (
            <div
              key={config.type}
              className={`glass-panel rounded-2xl p-6 transition-all border ${
                earned 
                  ? 'border-[var(--accent)] bg-indigo-500/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-[var(--accent-light)]' 
                  : 'border-[var(--border)] opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                    earned 
                      ? 'bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)] border-[var(--accent)] text-white' 
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}>
                  {earned ? config.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold truncate ${earned ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {config.name}
                  </div>
                  <div className={`text-xs mt-1 leading-snug ${earned ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                    {config.description}
                  </div>
                  {earned && badge && (
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-3 text-[var(--accent-light)] bg-[var(--accent-glow)] inline-block px-2 py-0.5 rounded-md">
                      Earned {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                  )}
                  {!earned && (
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-3 text-[var(--text-muted)] border border-[var(--border)] inline-block px-2 py-0.5 rounded-md">
                      Locked
                    </div>
                  )}
                </div>
                {earned && (
                  <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    ✓
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
