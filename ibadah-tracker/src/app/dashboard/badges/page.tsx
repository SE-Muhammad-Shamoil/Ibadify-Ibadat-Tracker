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
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Achievements</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {badges.length} of {BADGES_CONFIG.length} badges earned
        </p>
      </div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>Collection Progress</span>
          <span className="text-sm font-bold" style={{ color: '#818cf8' }}>
            {Math.round(badges.length / BADGES_CONFIG.length * 100)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: 'rgba(51,65,85,0.5)' }}>
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{
              width: `${badges.length / BADGES_CONFIG.length * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              boxShadow: '0 0 10px rgba(99,102,241,0.5)',
            }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES_CONFIG.map((config) => {
          const earned = earnedTypes.has(config.type)
          const badge = badges.find(b => b.badge_type === config.type)
          return (
            <div
              key={config.type}
              className={`glass rounded-2xl p-5 card-hover transition-all ${!earned ? 'opacity-40' : ''}`}
              style={{
                border: earned ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(51,65,85,0.5)',
                background: earned ? 'rgba(99,102,241,0.1)' : 'rgba(15,23,42,0.8)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background: earned ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(167,139,250,0.2))' : 'rgba(51,65,85,0.3)',
                    border: earned ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(51,65,85,0.3)',
                  }}>
                  {earned ? config.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: earned ? '#e2e8f0' : '#64748b' }}>
                    {config.name}
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: earned ? '#94a3b8' : '#475569' }}>
                    {config.description}
                  </div>
                  {earned && badge && (
                    <div className="text-xs mt-1" style={{ color: '#6366f1' }}>
                      Earned {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                  )}
                  {!earned && (
                    <div className="text-xs mt-1" style={{ color: '#475569' }}>
                      Locked — Keep going!
                    </div>
                  )}
                </div>
                {earned && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
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
