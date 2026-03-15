'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import type { IbadahLog, Streak, Badge, PrayerName } from '@/lib/types'
import { PRAYER_NAMES, PRAYER_LABELS, BADGES_CONFIG } from '@/lib/types'
import { Check, Circle, Flame, Moon, BookOpen, Target, TrendingUp, Plus, Calendar, Activity } from 'lucide-react'

interface Props {
  todayLog: IbadahLog | null
  recentLogs: IbadahLog[]
  streaks: Streak[]
  badges: Badge[]
  userId: string
  today: string
}

const prayerStatus = (val: 0 | 1 | 2) => {
  if (val === 2) return { label: 'Jamāʿah', cls: 'prayer-jamaa', icon: Check }
  if (val === 1) return { label: 'Done', cls: 'prayer-done', icon: Check }
  return { label: 'Missed', cls: 'prayer-empty', icon: Circle }
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
          <p className="text-[var(--text-muted)] mt-1.5 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)]" /> {format(new Date(), 'EEEE, MMMM d')}
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
            const Icon = status.icon
            return (
              <div key={prayer} className="snap-start shrink-0 w-[140px] md:w-auto flex flex-col items-center gap-4 p-6 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] transition-all flex-none">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border-[2px] transition-colors ${val > 0 ? (val === 2 ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500') : 'bg-[var(--surface)] border-[var(--border)] text-[var(--border)]'}`}>
                  <Icon className="w-6 h-6" strokeWidth={3} />
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[15px] font-bold tracking-tight ${val > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {PRAYER_LABELS[prayer]}
                  </span>
                  {val === 2 && <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mt-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">Jamāʿah</span>}
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
              icon: Flame,
              color: 'var(--gold)',
            },
            {
              label: 'Prayers Today',
              value: `${totalPrayersToday}/5`,
              suffix: '',
              icon: Moon,
              color: 'var(--accent-light)',
            },
            {
              label: 'Quran Today',
              value: todayLog?.quran_pages ?? 0,
              suffix: 'pages',
              icon: BookOpen,
              color: '#3b82f6', // blue
            },
            {
              label: 'Zikr Today',
              value: totalZikrToday,
              suffix: 'times',
              icon: Target,
              color: '#a855f7', // purple
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-3xl p-5 border bg-[var(--surface-2)] border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: stat.color }} />
                </div>
                <div className="text-3xl font-extrabold mb-1 tracking-tight text-[var(--text-primary)]">
                  {stat.value}
                </div>
                <div className="text-[13px] font-semibold text-[var(--text-secondary)]">
                  {stat.label} <span className="text-[var(--text-muted)] font-medium ml-0.5">{stat.suffix}</span>
                </div>
              </div>
            )
          })}
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
              { href: '/dashboard/log', label: 'Log Prayers', icon: Moon, color: 'var(--accent)' },
              { href: '/dashboard/log#quran', label: 'Log Quran', icon: BookOpen, color: '#3b82f6' },
              { href: '/dashboard/log#zikr', label: 'Log Zikr', icon: Target, color: '#a855f7' },
              { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp, color: 'var(--gold)' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95 bg-[var(--surface-2)] shadow-sm hover:bg-[var(--border)] border border-transparent hover:border-white/5"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5" style={{ background: `${action.color}15`, color: action.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[14px] font-bold text-[var(--text-primary)]">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Link
        href="/dashboard/log"
        className="md:hidden fixed bottom-[90px] right-5 z-40 w-14 h-14 bg-[var(--accent)] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
      </Link>
    </div>
  )
}
