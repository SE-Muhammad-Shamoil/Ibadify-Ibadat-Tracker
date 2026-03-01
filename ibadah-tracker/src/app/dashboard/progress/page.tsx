import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, subDays } from 'date-fns'
import type { IbadahLog } from '@/lib/types'
import ProgressClient from './ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const { data: logs } = await supabase
    .from('ibadah_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('log_date', thirtyDaysAgo)
    .order('log_date', { ascending: true })

  return <ProgressClient logs={(logs || []) as IbadahLog[]} />
}
