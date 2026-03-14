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
      { label: 'Tap to log', bg: 'var(--surface)', border: 'var(--border)', text: 'var(--text-muted)', icon: '◯' },
      { label: 'Prayed', bg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))', border: 'rgba(16,185,129,0.3)', text: 'var(--green-light)', icon: '✓' },
      { label: 'Jamāʿah', bg: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(109,40,217,0.2))', border: 'rgba(139,92,246,0.4)', text: 'var(--accent-light)', icon: '✦' },
    ]
    const s = states[val]
    return (
      <button
        type="button"
        onClick={() => cyclePrayer(prayer)}
        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:-translate-y-1 active:scale-95 shadow-sm"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <span className="text-2xl" style={{ color: s.text }}>{s.icon}</span>
        <span className="text-sm font-semibold" style={{ color: s.text }}>{PRAYER_LABELS[prayer]}</span>
        <span className="text-xs" style={{ color: s.text === 'var(--text-muted)' ? 'var(--text-secondary)' : s.text, opacity: 0.8 }}>
          {PRAYER_TIMES[prayer]}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1" style={{
          background: val === 0 ? 'var(--surface-2)' : val === 1 ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)',
          color: s.text
        }}>
          {s.label}
        </span>
      </button>
    )
  }

  const CountInput = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-all hover:border-[var(--accent-glow)]">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: Math.max(0, (f[field] as number) - 1) }))}
          className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white border border-[var(--border)] active:scale-95">−</button>
        <input
          type="number" min={0} value={form[field] as number}
          onChange={e => setForm(f => ({ ...f, [field]: parseInt(e.target.value) || 0 }))}
          className="w-14 text-center text-lg font-bold bg-transparent border-none outline-none text-[var(--text-primary)]"
        />
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: (f[field] as number) + 1 }))}
          className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white border border-[var(--border)] active:scale-95">+</button>
      </div>
    </div>
  )

  const Toggle = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <button
      type="button"
      onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
      className="flex items-center gap-3 p-4 rounded-xl transition-all w-full text-left outline-none"
      style={{
        background: form[field] ? 'rgba(139,92,246,0.1)' : 'var(--surface-2)',
        border: `1px solid ${form[field] ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm font-semibold" style={{ color: form[field] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="w-11 h-6 rounded-full relative transition-all shadow-inner" style={{
        background: form[field] ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--surface)'
      }}>
        <div className="w-5 h-5 rounded-full absolute top-[2px] transition-all shadow-md" style={{
          background: 'white',
          left: form[field] ? '22px' : '2px',
        }} />
      </div>
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pb-12 pt-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Daily Log</h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">
          {format(new Date(), 'EEEE, MMMM d yyyy')} · Tap each prayer to cycle status
        </p>
      </div>

      {/* === FIVE PRAYERS === */}
      <section id="prayers" className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>🕌</span> Five Daily Prayers
          <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--accent)]">
            {PRAYER_NAMES.filter(p => form[p] > 0).length}/5
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {PRAYER_NAMES.map(p => <PrayerBtn key={p} prayer={p} />)}
        </div>
        <p className="text-[11px] uppercase tracking-wider mt-6 text-center text-[var(--text-muted)] font-bold">
          ◯ Not done <span className="mx-2">•</span> ✓ Prayed <span className="mx-2">•</span> ✦ With Jamāʿah
        </p>
      </section>

      {/* === OPTIONAL PRAYERS === */}
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>🌙</span> Optional Prayers
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Tahajjud (Night Prayer)" field="tahajjud" icon="🌌" />
          <Toggle label="Witr" field="witr" icon="✨" />
          <Toggle label="Duha (Forenoon)" field="duha" icon="☀️" />
          <Toggle label="Jumu'ah (Friday)" field="jummah" icon="🕌" />
        </div>
      </section>

      {/* === QURAN === */}
      <section id="quran" className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>📖</span> Qurʾān Recitation
        </h2>
        <div className="space-y-3">
          <CountInput label="Pages read" field="quran_pages" icon="📄" />
          <CountInput label="Minutes recited" field="quran_minutes" icon="⏱️" />
        </div>
      </section>

      {/* === ZIKR === */}
      <section id="zikr" className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>📿</span> Zikr & Tasbih
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <CountInput label="SubhānAllah" field="subhanallah_count" icon="✨" />
          <CountInput label="Alhamdulillah" field="alhamdulillah_count" icon="🤲" />
          <CountInput label="Allāhu Akbar" field="allahuakbar_count" icon="⭐" />
          <CountInput label="Istighfār" field="istighfar_count" icon="💧" />
        </div>
      </section>

      {/* === CHARACTER === */}
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>🌱</span> Character & Self-Purification
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Guarded my eyes" field="guard_eyes" icon="👁️" />
          <Toggle label="Guarded my ears" field="guard_ears" icon="👂" />
          <Toggle label="Controlled my anger" field="controlled_anger" icon="😤" />
          <Toggle label="Practiced patience (Sabr)" field="patience" icon="🕊️" />
        </div>
      </section>

      {/* === GOOD DEEDS === */}
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>🤲</span> Good Deeds
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Helped someone today" field="helped_someone" icon="🤝" />
          <Toggle label="Gave charity (Sadaqah)" field="gave_charity" icon="💝" />
        </div>
      </section>

      {/* === REFLECTION === */}
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
          <span>💭</span> Reflection Notes
        </h2>
        <textarea
          value={form.reflection_notes}
          onChange={e => setForm(f => ({ ...f, reflection_notes: e.target.value }))}
          placeholder="How was your day spiritually? What can you improve tomorrow? الحمد لله..."
          rows={4}
          className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all shadow-inner"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter)',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </section>

      {/* Save button */}
      <div className="sticky bottom-6 z-10 pt-4">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 text-white shadow-xl shadow-indigo-500/20"
          style={{
            background: saved
              ? 'linear-gradient(135deg, var(--green), var(--green-light))'
              : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
          }}
        >
          {saved ? '✓ Saved! Redirecting...' : saving ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
        </button>
      </div>
    </div>
  )
}
