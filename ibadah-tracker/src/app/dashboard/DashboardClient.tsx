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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#f1f5f9' }}>
            Assalamu Alaikum 🌙
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Link
          href="/dashboard/log"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          }}
        >
          + Log Today
        </Link>
      </div>

      {/* Today's prayer status */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: '#e2e8f0' }}>Today&apos;s Prayers</h2>
          {allPrayersDone && (
            <span className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
              ✨ All Complete!
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PRAYER_NAMES.map((prayer) => {
            const val = todayLog ? todayLog[prayer] : 0
            const status = prayerStatus(val as 0|1|2)
            return (
              <div key={prayer} className="flex flex-col items-center gap-2">
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl ${val > 0 ? 'prayer-done' : 'prayer-empty'} transition-all`}>
                  {val > 0 ? '✓' : '○'}
                </div>
                <span className="text-xs font-medium" style={{ color: val > 0 ? '#34d399' : '#64748b' }}>
                  {PRAYER_LABELS[prayer]}
                </span>
                {val === 2 && <span className="text-xs" style={{ color: '#818cf8' }}>Jamāʿah</span>}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm prayer-done" />
            <span className="text-xs" style={{ color: '#64748b' }}>Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm prayer-empty" />
            <span className="text-xs" style={{ color: '#64748b' }}>Not logged</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Prayer Streak',
            value: prayerStreak?.current_streak ?? 0,
            suffix: 'days',
            icon: '🔥',
            color: '#f59e0b',
            bgColor: 'rgba(245,158,11,0.1)',
          },
          {
            label: 'Prayers Today',
            value: `${totalPrayersToday}/5`,
            suffix: '',
            icon: '🕌',
            color: '#6366f1',
            bgColor: 'rgba(99,102,241,0.1)',
          },
          {
            label: 'Quran Today',
            value: todayLog?.quran_pages ?? 0,
            suffix: 'pages',
            icon: '📖',
            color: '#10b981',
            bgColor: 'rgba(16,185,129,0.1)',
          },
          {
            label: 'Zikr Today',
            value: totalZikrToday,
            suffix: 'times',
            icon: '📿',
            color: '#a78bfa',
            bgColor: 'rgba(167,139,250,0.1)',
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stat.color }} />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>
              {stat.label} {stat.suffix && <span style={{ color: '#94a3b8' }}>{stat.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Weekly streak visualization */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4" style={{ color: '#e2e8f0' }}>Last 7 Days</h2>
          <div className="flex gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const dateStr = format(new Date(Date.now() - (6 - i) * 86400000), 'yyyy-MM-dd')
              const log = recentLogs.find(l => l.log_date === dateStr)
              const prayers = log ? PRAYER_NAMES.filter(p => log[p] > 0).length : 0
              const label = format(new Date(Date.now() - (6 - i) * 86400000), 'EEE')
              const isToday = dateStr === today
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-lg transition-all"
                    style={{
                      height: '60px',
                      background: prayers === 5
                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                        : prayers > 0
                        ? `rgba(99,102,241,${0.2 + prayers * 0.15})`
                        : 'rgba(51,65,85,0.3)',
                      border: isToday ? '2px solid #6366f1' : '1px solid transparent',
                    }}
                  />
                  <span className="text-xs" style={{ color: isToday ? '#818cf8' : '#64748b' }}>{label}</span>
                  <span className="text-xs font-medium" style={{ color: prayers === 5 ? '#a5b4fc' : '#475569' }}>
                    {prayers}/5
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs" style={{ color: '#64748b' }}>Weekly completion</span>
            <span className="text-sm font-bold" style={{ color: weeklyRate > 70 ? '#10b981' : '#f59e0b' }}>
              {weeklyRate}%
            </span>
          </div>
        </div>

        {/* Recent badges */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: '#e2e8f0' }}>Achievements</h2>
            <Link href="/dashboard/badges" className="text-xs" style={{ color: '#6366f1' }}>View all →</Link>
          </div>
          {badges.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Start logging to earn badges!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {badges.slice(0, 6).map((badge) => {
                const config = BADGES_CONFIG.find(b => b.type === badge.badge_type)
                return (
                  <div key={badge.id} className="flex flex-col items-center gap-1 p-3 rounded-xl"
                    style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <span className="text-2xl">{config?.icon || '🏅'}</span>
                    <span className="text-xs text-center" style={{ color: '#94a3b8' }}>{badge.badge_name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4" style={{ color: '#e2e8f0' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/log', label: 'Log Prayers', icon: '🕌' },
            { href: '/dashboard/log#quran', label: 'Log Quran', icon: '📖' },
            { href: '/dashboard/log#zikr', label: 'Log Zikr', icon: '📿' },
            { href: '/dashboard/progress', label: 'View Progress', icon: '📈' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-sm font-medium" style={{ color: '#c7d2fe' }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
