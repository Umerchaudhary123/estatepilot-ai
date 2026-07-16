import { api } from '@/lib/api'
import { PropertyExplorer } from '@/components/property-explorer'
import { PublicShell } from '@/components/public-shell'

export const metadata={title:'Properties in Pakistan'}
export default async function PropertiesPage({searchParams}:{searchParams:Promise<{q?:string;purpose?:string}>}){const [all,params]=await Promise.all([api.properties(),searchParams]);const query=params.q??'';const purpose=params.purpose??'';return <PublicShell><section className="page-hero"><div className="container"><div className="eyebrow">AI property discovery</div><h1 className="heading" style={{marginTop:10}}>Find your next place in Pakistan</h1><p className="subheading">Verified homes across Islamabad, Lahore and Karachi—ranked around what matters to you.</p></div></section><section style={{padding:'15px 0 80px'}}><div className="container"><PropertyExplorer key={`${query}:${purpose}`} initialProperties={all} initialQuery={query} initialPurpose={purpose}/></div></section></PublicShell>}
