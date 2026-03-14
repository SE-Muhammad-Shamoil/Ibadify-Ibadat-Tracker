import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import type { Profile } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex text-[15px] bg-[var(--background)]">
      <Sidebar profile={profile as Profile | null} />
      <main className="flex-1 overflow-x-hidden pt-[72px] pb-[84px] md:pt-0 md:pb-0 relative">
        <div className="w-full max-w-[1200px] mx-auto md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
