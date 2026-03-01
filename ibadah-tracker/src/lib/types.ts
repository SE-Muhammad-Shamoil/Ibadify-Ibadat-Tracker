export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface IbadahLog {
  id: string
  user_id: string
  log_date: string
  fajr: 0 | 1 | 2
  dhuhr: 0 | 1 | 2
  asr: 0 | 1 | 2
  maghrib: 0 | 1 | 2
  isha: 0 | 1 | 2
  tahajjud: boolean
  witr: boolean
  duha: boolean
  jummah: boolean
  quran_pages: number
  quran_minutes: number
  subhanallah_count: number
  alhamdulillah_count: number
  allahuakbar_count: number
  istighfar_count: number
  guard_eyes: boolean
  guard_ears: boolean
  controlled_anger: boolean
  patience: boolean
  helped_someone: boolean
  gave_charity: boolean
  reflection_notes: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Streak {
  id: string
  user_id: string
  ibadah_type: string
  current_streak: number
  longest_streak: number
  last_completed_date: string | null
  updated_at: string
}

export interface Badge {
  id: string
  user_id: string
  badge_type: string
  badge_name: string
  earned_at: string
}

export interface CustomIbadah {
  id: string
  user_id: string
  name: string
  type: 'checkbox' | 'count' | 'time'
  category: string
  is_active: boolean
  created_at: string
}

export const PRAYER_NAMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
export type PrayerName = typeof PRAYER_NAMES[number]

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

export const PRAYER_TIMES: Record<PrayerName, string> = {
  fajr: 'Dawn',
  dhuhr: 'Midday',
  asr: 'Afternoon',
  maghrib: 'Sunset',
  isha: 'Night',
}

export const BADGES_CONFIG = [
  { type: 'first_log', name: 'First Step', description: 'Logged your first ibadah', icon: '🌱', requirement: 1 },
  { type: 'streak_7', name: 'Week Warrior', description: '7-day prayer streak', icon: '🔥', requirement: 7 },
  { type: 'streak_30', name: 'Month Master', description: '30-day prayer streak', icon: '⭐', requirement: 30 },
  { type: 'streak_100', name: 'Century Champion', description: '100-day prayer streak', icon: '💫', requirement: 100 },
  { type: 'quran_100', name: 'Quranic Journey', description: 'Read 100 pages of Quran', icon: '📖', requirement: 100 },
  { type: 'all_prayers', name: 'Perfect Day', description: 'Completed all 5 prayers in a day', icon: '🕌', requirement: 1 },
  { type: 'good_deed_7', name: 'Generous Heart', description: 'Helped others 7 times', icon: '🤲', requirement: 7 },
] as const
