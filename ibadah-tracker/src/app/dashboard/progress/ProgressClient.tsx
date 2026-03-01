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
        <div className="glass rounded-xl p-3 text-sm" style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
          <p className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Progress</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Last 30 days overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Prayers/Day', value: stats.avgPrayers, icon: '🕌', color: '#6366f1' },
          { label: 'Perfect Days', value: stats.perfectDays, icon: '⭐', color: '#f59e0b' },
          { label: 'Total Quran Pages', value: stats.totalQuran, icon: '📖', color: '#10b981' },
          { label: 'Total Zikr', value: stats.totalZikr.toLocaleString(), icon: '📿', color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5 card-hover">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Prayer completion line chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-6" style={{ color: '#e2e8f0' }}>📈 Daily Prayers — Last 30 Days</h2>
        {logs.length === 0 ? (
          <div className="text-center py-10" style={{ color: '#64748b' }}>
            <div className="text-5xl mb-3">📊</div>
            <p>Start logging to see your progress here!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last30Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false}
                interval={4} />
              <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="prayers" stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 3 }} name="Prayers" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quran bar chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-6" style={{ color: '#e2e8f0' }}>📖 Qurʾān Pages — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={last30Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quran" fill="#10b981" name="Pages" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap-style calendar */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4" style={{ color: '#e2e8f0' }}>🔥 Prayer Heatmap — Last 30 Days</h2>
        <div className="grid grid-cols-10 gap-2">
          {last30Days.map((day, i) => {
            const intensity = day.prayers / 5
            return (
              <div key={i} title={`${day.date}: ${day.prayers}/5 prayers`}
                className="aspect-square rounded-lg transition-all hover:scale-110 cursor-default"
                style={{
                  background: day.prayers === 0
                    ? 'rgba(51,65,85,0.3)'
                    : `rgba(99,102,241,${0.2 + intensity * 0.8})`,
                  border: day.prayers === 5 ? '1px solid rgba(99,102,241,0.6)' : '1px solid transparent',
                }}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-3 mt-4 justify-end">
          <span className="text-xs" style={{ color: '#64748b' }}>Less</span>
          {[0.1, 0.3, 0.5, 0.7, 1].map((op, i) => (
            <div key={i} className="w-4 h-4 rounded" style={{ background: `rgba(99,102,241,${op})` }} />
          ))}
          <span className="text-xs" style={{ color: '#64748b' }}>More</span>
        </div>
      </div>
    </div>
  )
}
