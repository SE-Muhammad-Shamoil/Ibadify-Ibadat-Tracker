import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, subDays } from 'date-fns'
import type { IbadahLog, Streak, Badge } from '@/lib/types'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = format(new Date(), 'yyyy-MM-dd')
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const [
    { data: todayLog },
    { data: recentLogs },
    { data: streaks },
    { data: badges },
  ] = await Promise.all([
    supabase.from('ibadah_logs').select('*').eq('user_id', user.id).eq('log_date', today).single(),
    supabase.from('ibadah_logs').select('*').eq('user_id', user.id).gte('log_date', sevenDaysAgo).order('log_date', { ascending: false }),
    supabase.from('streaks').select('*').eq('user_id', user.id),
    supabase.from('badges').select('*').eq('user_id', user.id),
  ])

  return (
    <DashboardClient
      todayLog={todayLog as IbadahLog | null}
      recentLogs={(recentLogs || []) as IbadahLog[]}
      streaks={(streaks || []) as Streak[]}
      badges={(badges || []) as Badge[]}
      userId={user.id}
      today={today}
    />
  )
}
