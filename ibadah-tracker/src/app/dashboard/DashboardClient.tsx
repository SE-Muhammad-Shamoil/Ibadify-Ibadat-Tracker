'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import type { IbadahLog, Streak, Badge, PrayerName } from '@/lib/types'
import { PRAYER_NAMES, PRAYER_LABELS, BADGES_CONFIG } from '@/lib/types'

interface Props {
  todayLog: IbadahLog | null
  recentLogs: IbadahLog[]
  streaks: Streak[]
  badges: Badge[]
  userId: string
  today: string
}

const prayerStatus = (val: 0 | 1 | 2) => {
  if (val === 2) return { label: 'Jamāʿah', cls: 'prayer-done', emoji: '✅' }
  if (val === 1) return { label: 'Done', cls: 'prayer-done', emoji: '✓' }
  return { label: 'Missed', cls: 'prayer-empty', emoji: '○' }
}

export default function DashboardClient({ todayLog, recentLogs, streaks, badges, today }: Props) {
  const prayerStreak = streaks.find(s => s.ibadah_type === 'all_prayers')
  const quranStreak = streaks.find(s => s.ibadah_type === 'quran')

  const allPrayersDone = todayLog
    ? PRAYER_NAMES.every(p => todayLog[p] > 0)
    : false

  const totalPrayersToday = todayLog
    ? PRAYER_NAMES.filter(p => todayLog[p] > 0).length
    : 0

  const totalZikrToday = todayLog
    ? (todayLog.subhanallah_count + todayLog.alhamdulillah_count + todayLog.allahuakbar_count + todayLog.istighfar_count)
    : 0

  // Weekly prayer completion rate
  const weeklyRate = recentLogs.length > 0
    ? Math.round(recentLogs.reduce((acc, log) => {
        return acc + PRAYER_NAMES.filter(p => log[p] > 0).length
      }, 0) / (recentLogs.length * 5) * 100)
    : 0

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Assalamu Alaikum 🌙
          </h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Link
          href="/dashboard/log"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-1 shadow-lg shadow-indigo-500/25 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white"
        >
          <span>+ Log Today</span>
        </Link>
      </div>

      {/* Today's prayer status */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Today&apos;s Prayers</h2>
          {allPrayersDone && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
              ✨ All Complete!
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {PRAYER_NAMES.map((prayer) => {
            const val = todayLog ? todayLog[prayer] : 0
            const status = prayerStatus(val as 0|1|2)
            return (
              <div key={prayer} className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-all hover:border-[var(--accent-glow)]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${val > 0 ? (val === 2 ? 'prayer-jamaa text-white' : 'prayer-done text-white') : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'} transition-all`}>
                  {val > 0 ? '✓' : '○'}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${val > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {PRAYER_LABELS[prayer]}
                  </span>
                  {val === 2 && <span className="text-xs text-[var(--accent-light)] font-medium">Jamāʿah</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: 'Prayer Streak',
            value: prayerStreak?.current_streak ?? 0,
            suffix: 'days',
            icon: '🔥',
            color: 'var(--gold)',
            bgClass: 'bg-amber-500/10 border-amber-500/20',
          },
          {
            label: 'Prayers Today',
            value: `${totalPrayersToday}/5`,
            suffix: '',
            icon: '🕌',
            color: 'var(--accent-light)',
            bgClass: 'bg-indigo-500/10 border-indigo-500/20',
          },
          {
            label: 'Quran Today',
            value: todayLog?.quran_pages ?? 0,
            suffix: 'pages',
            icon: '📖',
            color: 'var(--green-light)',
            bgClass: 'bg-emerald-500/10 border-emerald-500/20',
          },
          {
            label: 'Zikr Today',
            value: totalZikrToday,
            suffix: 'times',
            icon: '📿',
            color: '#c084fc',
            bgClass: 'bg-purple-500/10 border-purple-500/20',
          },
        ].map((stat) => (
          <div key={stat.label} className={`glass-panel rounded-2xl p-6 card-hover border-t ${stat.bgClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl bg-[var(--surface-2)] w-10 h-10 rounded-full flex items-center justify-center shadow-inner">{stat.icon}</span>
              <div className="w-2 h-2 rounded-full animate-pulse shadow-lg" style={{ background: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
            </div>
            <div className="text-3xl font-bold mb-1 tracking-tight" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {stat.label} {stat.suffix && <span className="text-[var(--text-muted)] font-normal ml-1">{stat.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly streak visualization */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">Last 7 Days</h2>
          <div className="flex justify-between gap-1 md:gap-3">
            {Array.from({ length: 7 }, (_, i) => {
              const dateStr = format(new Date(Date.now() - (6 - i) * 86400000), 'yyyy-MM-dd')
              const log = recentLogs.find(l => l.log_date === dateStr)
              const prayers = log ? PRAYER_NAMES.filter(p => log[p] > 0).length : 0
              const label = format(new Date(Date.now() - (6 - i) * 86400000), 'EEE')
              const isToday = dateStr === today
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full rounded-xl transition-all duration-300 relative overflow-hidden"
                    style={{
                      height: '80px',
                      background: prayers === 5
                        ? 'linear-gradient(180deg, var(--accent-light), var(--accent))'
                        : prayers > 0
                        ? `rgba(139, 92, 246, ${0.15 + prayers * 0.15})`
                        : 'var(--surface-2)',
                      border: isToday ? '2px solid var(--accent-light)' : '1px solid var(--border)',
                      boxShadow: prayers === 5 ? '0 0 15px rgba(139,92,246,0.3)' : 'none'
                    }}
                  >
                     {/* Subtle fill effect styling trick */}
                     <div className="absolute bottom-0 left-0 right-0 bg-white/10 transition-all duration-500" style={{ height: `${(prayers/5)*100}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? 'text-[var(--accent-light)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
                  <span className={`text-xs font-bold ${prayers === 5 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {prayers}/5
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Weekly completion</span>
            <span className={`text-lg font-bold ${weeklyRate > 70 ? 'text-[var(--green-light)]' : 'text-[var(--gold)]'}`}>
              {weeklyRate}%
            </span>
          </div>
        </div>

        {/* Recent badges */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Achievements</h2>
            <Link href="/dashboard/badges" className="text-sm font-medium text-[var(--accent-light)] hover:text-white transition-colors">View collection →</Link>
          </div>
          {badges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
              <div className="text-5xl mb-3 grayscale opacity-50">🎯</div>
              <p className="text-[var(--text-muted)] font-medium">
                Log activities to earn your first badge!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.slice(0, 6).map((badge) => {
                const config = BADGES_CONFIG.find(b => b.type === badge.badge_type)
                return (
                  <div key={badge.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-glow)] transition-all group">
                    <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform">{config?.icon || '🏅'}</span>
                    <span className="text-xs text-center font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{badge.badge_name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/dashboard/log', label: 'Log Prayers', icon: '🕌' },
            { href: '/dashboard/log#quran', label: 'Log Quran', icon: '📖' },
            { href: '/dashboard/log#zikr', label: 'Log Zikr', icon: '📿' },
            { href: '/dashboard/progress', label: 'View Progress', icon: '📈' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left gap-3 p-4 rounded-xl transition-all hover:-translate-y-1 bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)] group"
            >
              <span className="text-2xl md:text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
