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
      { label: 'Tap to log', bg: 'var(--surface-2)', border: 'var(--border)', text: 'var(--text-muted)', icon: '◯' },
      { label: 'Prayed', bg: 'var(--green-light)', border: 'var(--green)', text: '#ffffff', icon: '✓' },
      { label: 'Jamāʿah', bg: 'var(--accent)', border: 'var(--accent-light)', text: '#ffffff', icon: '✦' },
    ]
    const s = states[val]
    return (
      <button
        type="button"
        onClick={() => cyclePrayer(prayer)}
        className="flex flex-col items-center gap-1.5 p-5 rounded-3xl transition-all active:scale-95 shadow-sm"
        style={{ background: val === 0 ? s.bg : `linear-gradient(135deg, ${s.bg}, ${s.border})`, border: val === 0 ? `1px solid ${s.border}` : `1px solid transparent` }}
      >
        <span className="text-3xl" style={{ color: s.text }}>{s.icon}</span>
        <span className="text-[15px] font-bold" style={{ color: s.text }}>{PRAYER_LABELS[prayer]}</span>
        <span className="text-[12px] font-medium" style={{ color: val === 0 ? 'var(--text-secondary)' : 'rgba(255,255,255,0.8)' }}>
          {PRAYER_TIMES[prayer]}
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full mt-2" style={{
          background: val === 0 ? 'var(--surface)' : 'rgba(0,0,0,0.15)',
          color: s.text
        }}>
          {s.label}
        </span>
      </button>
    )
  }

  const CountInput = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <div className="flex items-center justify-between p-4 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] transition-all">
      <div className="flex items-center gap-4 pl-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-[15px] font-bold text-[var(--text-primary)]">{label}</span>
      </div>
      <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-2xl border border-[var(--border)]">
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: Math.max(0, (f[field] as number) - 1) }))}
          className="w-12 h-12 rounded-xl font-bold text-xl transition-all active:scale-90 flex items-center justify-center text-[var(--text-secondary)] bg-[var(--surface-2)] shadow-sm">−</button>
        <input
          type="number" min={0} value={form[field] as number}
          onChange={e => setForm(f => ({ ...f, [field]: parseInt(e.target.value) || 0 }))}
          className="w-12 text-center text-lg font-bold bg-transparent border-none outline-none text-[var(--text-primary)]"
        />
        <button type="button" onClick={() => setForm(f => ({ ...f, [field]: (f[field] as number) + 1 }))}
          className="w-12 h-12 rounded-xl font-bold text-xl transition-all active:scale-90 flex items-center justify-center text-[var(--text-primary)] bg-[var(--surface-2)] shadow-sm">+</button>
      </div>
    </div>
  )

  const Toggle = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: string }) => (
    <button
      type="button"
      onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
      className={`flex items-center gap-4 p-5 rounded-3xl transition-all w-full text-left outline-none bg-[var(--surface-2)] border border-[var(--border)] active:scale-[0.98] ${form[field] ? 'border-[var(--accent)] bg-opacity-80' : ''}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-1 text-[15px] font-bold" style={{ color: form[field] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="w-[52px] h-[32px] rounded-full relative transition-all shadow-inner border border-[var(--border)]" style={{
        background: form[field] ? 'var(--green)' : 'var(--surface)'
      }}>
        <div className="w-[28px] h-[28px] rounded-full absolute top-[1px] transition-all shadow-md bg-white" style={{
          left: form[field] ? '21px' : '1px',
        }} />
      </div>
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-[120px] pt-4 px-4 md:px-0">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Daily Log</h1>
        <p className="text-[var(--text-muted)] mt-1 font-medium">
          {format(new Date(), 'EEEE, MMMM d yyyy')}
        </p>
      </div>

      {/* === FIVE PRAYERS === */}
      <section id="prayers" className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>🕌</span> Fardh Prayers
          <span className="ml-auto text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)]">
            {PRAYER_NAMES.filter(p => form[p] > 0).length}/5 Done
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {PRAYER_NAMES.map(p => <PrayerBtn key={p} prayer={p} />)}
        </div>
      </section>

      {/* === OPTIONAL PRAYERS === */}
      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>🌙</span> Sunnah Prayers
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Tahajjud" field="tahajjud" icon="🌌" />
          <Toggle label="Witr" field="witr" icon="✨" />
          <Toggle label="Duha" field="duha" icon="☀️" />
          <Toggle label="Jumu'ah" field="jummah" icon="🕌" />
        </div>
      </section>

      {/* === QURAN === */}
      <section id="quran" className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>📖</span> Qurʾān
        </h2>
        <div className="space-y-3">
          <CountInput label="Pages read" field="quran_pages" icon="📄" />
          <CountInput label="Minutes recited" field="quran_minutes" icon="⏱️" />
        </div>
      </section>

      {/* === ZIKR === */}
      <section id="zikr" className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>📿</span> Zikr
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <CountInput label="SubhānAllah" field="subhanallah_count" icon="✨" />
          <CountInput label="Alhamdulillah" field="alhamdulillah_count" icon="🤲" />
          <CountInput label="Allāhu Akbar" field="allahuakbar_count" icon="⭐" />
          <CountInput label="Istighfār" field="istighfar_count" icon="💧" />
        </div>
      </section>

      {/* === CHARACTER === */}
      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>🌱</span> Character
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Guarded eyes" field="guard_eyes" icon="👁️" />
          <Toggle label="Guarded ears" field="guard_ears" icon="👂" />
          <Toggle label="Controlled anger" field="controlled_anger" icon="😤" />
          <Toggle label="Practiced Sabr" field="patience" icon="🕊️" />
          <Toggle label="Helped someone" field="helped_someone" icon="🤝" />
          <Toggle label="Gave charity" field="gave_charity" icon="💝" />
        </div>
      </section>

      {/* === REFLECTION === */}
      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)] tracking-tight">
          <span>💭</span> Thoughts
        </h2>
        <textarea
          value={form.reflection_notes}
          onChange={e => setForm(f => ({ ...f, reflection_notes: e.target.value }))}
          placeholder="How was your day? الحمد لله..."
          rows={3}
          className="w-full rounded-2xl p-5 text-[15px] resize-none outline-none transition-all focus:border-[var(--accent)]"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter)',
          }}
        />
      </section>

      {/* Save button (Fixed Bottom for Mobile Navigation) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)]/80 backdrop-blur-3xl border-t border-[var(--border)] p-4 pb-safe pb-[76px] md:pb-4 md:sticky flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full py-4 rounded-2xl font-extrabold text-[16px] transition-all active:scale-95 disabled:opacity-70 text-white shadow-[0_4px_20px_rgba(94,92,230,0.4)]"
            style={{
              background: saved
                ? 'var(--green)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            }}
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : existingLog ? 'Update My Log' : 'Save My Log'}
          </button>
        </div>
      </div>
    </div>
  )
}
