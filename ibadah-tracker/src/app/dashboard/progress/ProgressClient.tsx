'use client'

import { useMemo } from 'react'
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'
import type { IbadahLog } from '@/lib/types'
import { PRAYER_NAMES } from '@/lib/types'

interface Props {
  logs: IbadahLog[]
}

export default function ProgressClient({ logs }: Props) {
  const last30Days = useMemo(() => {
    return eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const log = logs.find(l => l.log_date === dateStr)
      const prayers = log ? PRAYER_NAMES.filter(p => log[p] > 0).length : 0
      const zikr = log ? (log.subhanallah_count + log.alhamdulillah_count + log.allahuakbar_count + log.istighfar_count) : 0
      return {
        date: format(date, 'MMM d'),
        prayers,
        quran: log?.quran_pages || 0,
        zikr,
        logged: !!log,
      }
    })
  }, [logs])

  const stats = useMemo(() => {
    const logsWithData = logs.filter(l => PRAYER_NAMES.some(p => l[p] > 0))
    const avgPrayers = logsWithData.length > 0
      ? (logsWithData.reduce((a, l) => a + PRAYER_NAMES.filter(p => l[p] > 0).length, 0) / logsWithData.length).toFixed(1)
      : '0'
    const totalQuran = logs.reduce((a, l) => a + l.quran_pages, 0)
    const totalZikr = logs.reduce((a, l) => a + l.subhanallah_count + l.alhamdulillah_count + l.allahuakbar_count + l.istighfar_count, 0)
    const perfectDays = logs.filter(l => PRAYER_NAMES.every(p => l[p] > 0)).length
    return { avgPrayers, totalQuran, totalZikr, perfectDays }
  }, [logs])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass-panel rounded-xl p-4 text-sm shadow-xl border border-[var(--border)]">
          <p className="font-semibold mb-2 text-[var(--text-primary)]">{label}</p>
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center gap-2 font-medium" style={{ color: p.color }}>
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }}></div>
              <span>{p.name}: <span className="font-bold">{p.value}</span></span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">Progress</h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">Last 30 days overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Avg Prayers/Day', value: stats.avgPrayers, icon: '🕌', color: 'var(--accent-light)', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Perfect Days', value: stats.perfectDays, icon: '⭐', color: 'var(--gold)', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Total Quran Pages', value: stats.totalQuran, icon: '📖', color: 'var(--green-light)', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Total Zikr', value: stats.totalZikr.toLocaleString(), icon: '📿', color: '#c084fc', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(s => (
          <div key={s.label} className={`glass-panel rounded-2xl p-6 card-hover border-t ${s.bg}`}>
            <div className="text-3xl mb-3 bg-[var(--surface-2)] w-12 h-12 rounded-full flex items-center justify-center shadow-inner">{s.icon}</div>
            <div className="text-3xl font-bold mb-1 tracking-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prayer completion line chart */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
            <span>📈</span> Daily Prayers
          </h2>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
              <div className="text-5xl mb-3 grayscale opacity-50">📊</div>
              <p className="text-[var(--text-muted)] font-medium">Start logging to see your progress here!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={last30Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis domain={[0, 5]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="prayers" stroke="var(--accent-light)" strokeWidth={3}
                  dot={{ fill: 'var(--surface)', stroke: 'var(--accent-light)', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: 'var(--accent-light)', stroke: 'white' }} name="Prayers" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quran bar chart */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
            <span>📖</span> Qurʾān Pages
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last30Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-2)', opacity: 0.5 }} />
              <Bar dataKey="quran" fill="var(--green-light)" name="Pages" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap-style calendar */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>🔥</span> Prayer Heatmap
        </h2>
        <div className="grid grid-cols-10 gap-2 md:gap-3">
          {last30Days.map((day, i) => {
            const intensity = day.prayers / 5
            return (
              <div key={i} title={`${day.date}: ${day.prayers}/5 prayers`}
                className="aspect-square rounded-xl transition-all hover:scale-110 cursor-default"
                style={{
                  background: day.prayers === 0
                    ? 'var(--surface-2)'
                    : `rgba(139, 92, 246, ${0.15 + intensity * 0.85})`, // using accent color relative to intensity
                  border: day.prayers === 5 ? '1px solid var(--accent-light)' : '1px solid var(--border)',
                  boxShadow: day.prayers === 5 ? '0 0 10px rgba(139,92,246,0.2)' : 'none'
                }}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-3 mt-8 justify-end">
          <span className="text-sm font-medium text-[var(--text-muted)]">Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div key={i} className="w-5 h-5 rounded-md" 
              style={{ 
                background: intensity === 0 ? 'var(--surface-2)' : `rgba(139, 92, 246, ${0.15 + intensity * 0.85})`,
                border: intensity === 1 ? '1px solid var(--accent-light)' : 'none'
              }} 
            />
          ))}
          <span className="text-sm font-medium text-[var(--text-muted)]">More</span>
        </div>
      </div>
    </div>
  )
}
