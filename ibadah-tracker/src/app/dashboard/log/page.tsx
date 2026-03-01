import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import type { IbadahLog } from '@/lib/types'
import LogClient from './LogClient'

export default async function LogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = format(new Date(), 'yyyy-MM-dd')

  const { data: existingLog } = await supabase
    .from('ibadah_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', today)
    .single()

  return <LogClient existingLog={existingLog as IbadahLog | null} userId={user.id} today={today} />
}
