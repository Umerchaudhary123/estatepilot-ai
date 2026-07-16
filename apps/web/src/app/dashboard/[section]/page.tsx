import { DashboardSection } from '@/components/dashboard-section'
import { SESSION_COOKIE, verifySession } from '@/lib/auth'
import { canAccess } from '@/lib/permissions'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const sections=['leads','pipeline','conversations','properties','appointments','workflows','knowledge','analytics','team','ai-settings','integrations','billing','settings']
export function generateStaticParams(){return sections.map((section)=>({section}))}
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params;const session=verifySession((await cookies()).get(SESSION_COOKIE)?.value);if(!session)redirect('/auth');if(!canAccess(session.role,section))redirect('/dashboard');return <DashboardSection section={section}/>}
