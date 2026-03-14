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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-4 md:mt-0 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            Assalamu Alaikum
          </h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium flex items-center gap-2">
            <span>📅</span> {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
      </div>

      {/* Today's prayer status */}
      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Today's Prayers</h2>
          {allPrayersDone && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(48,209,88,0.2)]">
              Complete
            </span>
          )}
        </div>
        {/* Horizontal scroll on mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible hide-scrollbar">
          {PRAYER_NAMES.map((prayer) => {
            const val = todayLog ? todayLog[prayer] : 0
            const status = prayerStatus(val as 0|1|2)
            return (
              <div key={prayer} className="snap-start shrink-0 w-[140px] md:w-auto flex flex-col items-center gap-3 p-5 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] transition-all flex-none">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-[3px] ${val > 0 ? (val === 2 ? 'prayer-jamaa border-[var(--accent-light)] text-white' : 'prayer-done border-[var(--green-light)] text-white') : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'}`}>
                  {val > 0 ? '✓' : '○'}
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[15px] font-bold tracking-tight ${val > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {PRAYER_LABELS[prayer]}
                  </span>
                  {val === 2 && <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-light)] mt-1 bg-[var(--accent-glow)] px-2 py-0.5 rounded-md">Jamāʿah</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 md:px-0">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            {
              label: 'Prayer Streak',
              value: prayerStreak?.current_streak ?? 0,
              suffix: 'days',
              icon: '🔥',
              color: 'var(--gold)',
              bgClass: 'bg-[var(--surface-2)] border-[var(--border)]',
            },
            {
              label: 'Prayers Today',
              value: `${totalPrayersToday}/5`,
              suffix: '',
              icon: '🕌',
              color: 'var(--accent-light)',
              bgClass: 'bg-[var(--surface-2)] border-[var(--border)]',
            },
            {
              label: 'Quran Today',
              value: todayLog?.quran_pages ?? 0,
              suffix: 'pages',
              icon: '📖',
              color: 'var(--green-light)',
              bgClass: 'bg-[var(--surface-2)] border-[var(--border)]',
            },
            {
              label: 'Zikr Today',
              value: totalZikrToday,
              suffix: 'times',
              icon: '📿',
              color: '#bf5af2', // matching iOS purple
              bgClass: 'bg-[var(--surface-2)] border-[var(--border)]',
            },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-3xl p-5 border ${stat.bgClass}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <div className="w-2 h-2 rounded-full shadow-lg" style={{ background: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
              </div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </div>
              <div className="text-[13px] font-semibold text-[var(--text-secondary)]">
                {stat.label} <span className="text-[var(--text-muted)] font-medium ml-0.5">{stat.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6 px-4 md:px-0">
        {/* Weekly streak visualization */}
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">Weekly Pulse</h2>
          <div className="flex justify-between gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const dateStr = format(new Date(Date.now() - (6 - i) * 86400000), 'yyyy-MM-dd')
              const log = recentLogs.find(l => l.log_date === dateStr)
              const prayers = log ? PRAYER_NAMES.filter(p => log[p] > 0).length : 0
              const label = format(new Date(Date.now() - (6 - i) * 86400000), 'ee') // very short day (e.g. 'M', 'T')
              const isToday = dateStr === today
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div
                    className="w-full rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{
                      height: '100px',
                      background: prayers === 5
                        ? 'linear-gradient(180deg, var(--accent-light), var(--accent))'
                        : prayers > 0
                        ? `rgba(94, 92, 230, ${0.15 + prayers * 0.15})`
                        : 'var(--surface-2)',
                      border: isToday ? '2px solid var(--text-primary)' : '1px solid transparent',
                      boxShadow: prayers === 5 ? '0 0 15px rgba(94,92,230,0.3)' : 'none'
                    }}
                  />
                  <span className={`text-[13px] font-bold ${isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions (replacing achievements here for better UX) */}
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/log', label: 'Log Prayers', icon: '🕌', color: 'var(--accent)' },
              { href: '/dashboard/log#quran', label: 'Log Quran', icon: '📖', color: 'var(--green)' },
              { href: '/dashboard/log#zikr', label: 'Log Zikr', icon: '📿', color: '#bf5af2' },
              { href: '/dashboard/progress', label: 'Progress', icon: '📈', color: 'var(--gold)' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95 bg-[var(--surface-2)] shadow-sm"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${action.color}20`, color: action.color }}>
                  {action.icon}
                </div>
                <span className="text-[14px] font-bold text-[var(--text-primary)]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Link
        href="/dashboard/log"
        className="md:hidden fixed bottom-[90px] right-5 z-40 w-14 h-14 bg-[var(--accent)] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(94,92,230,0.6)] active:scale-90 transition-transform"
      >
        <span className="text-2xl font-light">+</span>
      </Link>
    </div>
  )
}
