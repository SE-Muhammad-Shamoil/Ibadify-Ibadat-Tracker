'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { IbadahLog, PrayerName } from '@/lib/types'
import { PRAYER_NAMES, PRAYER_LABELS, PRAYER_TIMES } from '@/lib/types'

interface Props {
  existingLog: IbadahLog | null
  userId: string
  today: string
}

type PrayerStatus = 0 | 1 | 2

const defaultForm = {
  fajr: 0 as PrayerStatus, dhuhr: 0 as PrayerStatus, asr: 0 as PrayerStatus,
  maghrib: 0 as PrayerStatus, isha: 0 as PrayerStatus,
  tahajjud: false, witr: false, duha: false, jummah: false,
  quran_pages: 0, quran_minutes: 0,
  subhanallah_count: 0, alhamdulillah_count: 0, allahuakbar_count: 0, istighfar_count: 0,
  guard_eyes: false, guard_ears: false, controlled_anger: false, patience: false,
  helped_someone: false, gave_charity: false,
  reflection_notes: '',
}

export default function LogClient({ existingLog, userId, today }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState(() => existingLog ? {
    fajr: existingLog.fajr as PrayerStatus,
    dhuhr: existingLog.dhuhr as PrayerStatus,
    asr: existingLog.asr as PrayerStatus,
    maghrib: existingLog.maghrib as PrayerStatus,
    isha: existingLog.isha as PrayerStatus,
    tahajjud: existingLog.tahajjud,
    witr: existingLog.witr,
    duha: existingLog.duha,
    jummah: existingLog.jummah,
    quran_pages: existingLog.quran_pages,
    quran_minutes: existingLog.quran_minutes,
    subhanallah_count: existingLog.subhanallah_count,
    alhamdulillah_count: existingLog.alhamdulillah_count,
    allahuakbar_count: existingLog.allahuakbar_count,
    istighfar_count: existingLog.istighfar_count,
    guard_eyes: existingLog.guard_eyes,
    guard_ears: existingLog.guard_ears,
    controlled_anger: existingLog.controlled_anger,
    patience: existingLog.patience,
    helped_someone: existingLog.helped_someone,
    gave_charity: existingLog.gave_charity,
    reflection_notes: existingLog.reflection_notes || '',
  } : defaultForm)

  const cyclePrayer = (prayer: PrayerName) => {
    setForm(f => ({ ...f, [prayer]: ((f[prayer] + 1) % 3) as PrayerStatus }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, user_id: userId, log_date: today }
    
    if (existingLog) {
      await supabase.from('ibadah_logs').update(payload).eq('id', existingLog.id)
    } else {
      await supabase.from('ibadah_logs').insert(payload)
    }

    // Check and award badges
    await checkBadges()
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/dashboard') }, 1500)
  }

  const checkBadges = async () => {
    const allPrayersDone = PRAYER_NAMES.every(p => form[p] > 0)
    if (allPrayersDone) {
      await supabase.from('badges').upsert({
        user_id: userId, badge_type: 'all_prayers', badge_name: 'Perfect Day'
      }, { onConflict: 'user_id,badge_type' })
    }
    await supabase.from('badges').upsert({
      user_id: userId, badge_type: 'first_log', badge_name: 'First Step'
    }, { onConflict: 'user_id,badge_type' })
  }

  const PrayerBtn = ({ prayer }: { prayer: PrayerName }) => {
    const val = form[prayer]
    const states = [
      { label: 'Tap to log', bg: 'rgba(51,65,85,0.4)', border: 'rgba(148,163,184,0.15)', text: '#64748b', icon: '◯' },
      { label: 'Prayed', bg: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.2))', border: 'rgba(16,185,129,0.4)', text: '#34d399', icon: '✓' },
      { label: 'Jamāʿah', bg: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(79,70,229,0.3))', border: 'rgba(99,102,241,0.5)', text: '#a5b4fc', icon: '✦' },
    ]
    const s = states[val]
    return (
      <button
        type="button"
        onClick={() => cyclePrayer(prayer)}
        className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <span className="text-2xl" style={{ color: s.text }}>{s.icon}</span>
        <span className="text-sm font-semibold" style={{ color: s.text }}>{PRAYER_LABELS[prayer]}</span>
        <span className="text-xs" style={{ color: s.text === '#64748b' ? '#475569' : s.text, opacity: 0.8 }}>
          {PRAYER_TIMES[prayer]}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          background: val === 0 ? 'rgba(100,116,139,0.2)' : val === 1 ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)',
          color: s.text
        }}>
          {s.label}
        </span>
      </button>
    )
  }

  const CountInput = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium" style={{ color: '#c7d2fe' }}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: Math.max(0, (f[field] as number) - 1) }))}
          className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10 flex items-center justify-center"
          style={{ color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}>−</button>
        <input
          type="number" min={0} value={form[field] as number}
          onChange={e => setForm(f => ({ ...f, [field]: parseInt(e.target.value) || 0 }))}
          className="w-14 text-center text-sm font-bold bg-transparent border-none outline-none"
          style={{ color: '#f1f5f9' }}
        />
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: (f[field] as number) + 1 }))}
          className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10 flex items-center justify-center"
          style={{ color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}>+</button>
      </div>
    </div>
  )

  const Toggle = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <button
      type="button"
      onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{
        background: form[field] ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.5)',
        border: `1px solid ${form[field] ? 'rgba(99,102,241,0.4)' : 'rgba(51,65,85,0.5)'}`,
      }}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm font-medium text-left" style={{ color: form[field] ? '#a5b4fc' : '#94a3b8' }}>
        {label}
      </span>
      <div className="w-10 h-5 rounded-full relative transition-all" style={{
        background: form[field] ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(51,65,85,0.8)'
      }}>
        <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{
          background: 'white',
          left: form[field] ? '22px' : '2px',
        }} />
      </div>
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Daily Log</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {format(new Date(), 'EEEE, MMMM d yyyy')} · Tap each prayer to cycle status
        </p>
      </div>

      {/* === FIVE PRAYERS === */}
      <section id="prayers" className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>🕌</span> Five Daily Prayers
          <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
            {PRAYER_NAMES.filter(p => form[p] > 0).length}/5
          </span>
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {PRAYER_NAMES.map(p => <PrayerBtn key={p} prayer={p} />)}
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: '#475569' }}>
          ◯ Not done → ✓ Prayed → ✦ With Jamāʿah
        </p>
      </section>

      {/* === OPTIONAL PRAYERS === */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>🌙</span> Optional Prayers
        </h2>
        <div className="grid grid-cols-1 gap-2">
          <Toggle label="Tahajjud (Night Prayer)" field="tahajjud" icon="🌙" />
          <Toggle label="Witr" field="witr" icon="⚡" />
          <Toggle label="Duha (Forenoon)" field="duha" icon="☀️" />
          <Toggle label="Jumu'ah (Friday)" field="jummah" icon="🕌" />
        </div>
      </section>

      {/* === QURAN === */}
      <section id="quran" className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>📖</span> Qurʾān Recitation
        </h2>
        <div className="space-y-2">
          <CountInput label="Pages read" field="quran_pages" icon="📄" />
          <CountInput label="Minutes recited" field="quran_minutes" icon="⏱️" />
        </div>
      </section>

      {/* === ZIKR === */}
      <section id="zikr" className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>📿</span> Zikr & Tasbih
        </h2>
        <div className="space-y-2">
          <CountInput label="SubhānAllah" field="subhanallah_count" icon="✨" />
          <CountInput label="Alhamdulillah" field="alhamdulillah_count" icon="🙏" />
          <CountInput label="Allāhu Akbar" field="allahuakbar_count" icon="⭐" />
          <CountInput label="Istighfār (Astaghfirullah)" field="istighfar_count" icon="💧" />
        </div>
      </section>

      {/* === CHARACTER === */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>🌱</span> Character & Self-Purification
        </h2>
        <div className="space-y-2">
          <Toggle label="Guarded my eyes" field="guard_eyes" icon="👁️" />
          <Toggle label="Guarded my ears" field="guard_ears" icon="👂" />
          <Toggle label="Controlled my anger" field="controlled_anger" icon="😤" />
          <Toggle label="Practiced patience (Sabr)" field="patience" icon="🕊️" />
        </div>
      </section>

      {/* === GOOD DEEDS === */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>🤲</span> Good Deeds
        </h2>
        <div className="space-y-2">
          <Toggle label="Helped someone today" field="helped_someone" icon="🤝" />
          <Toggle label="Gave charity (Sadaqah)" field="gave_charity" icon="💝" />
        </div>
      </section>

      {/* === REFLECTION === */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
          <span>💭</span> Reflection Notes
        </h2>
        <textarea
          value={form.reflection_notes}
          onChange={e => setForm(f => ({ ...f, reflection_notes: e.target.value }))}
          placeholder="How was your day spiritually? What can you improve tomorrow? الحمد لله..."
          rows={4}
          className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
          style={{
            background: 'rgba(30,41,59,0.6)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#e2e8f0',
            fontFamily: 'var(--font-inter)',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
        />
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
        style={{
          background: saved
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'linear-gradient(135deg, #6366f1, #4f46e5)',
          boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
        }}
      >
        {saved ? '✓ Saved! Redirecting...' : saving ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
      </button>
    </div>
  )
}
