import { DashboardShell } from '@/components/dashboard-shell'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySession } from '@/lib/auth'

export default async function Layout({children}:{children:React.ReactNode}){const session=verifySession((await cookies()).get(SESSION_COOKIE)?.value);if(!session)redirect('/auth');return <DashboardShell>{children}</DashboardShell>}
