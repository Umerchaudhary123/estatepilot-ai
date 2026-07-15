import { properties } from '@estatepilot/shared'
import { Heart } from 'lucide-react'
import { PropertyCard } from '@/components/property-card'
import { PublicShell } from '@/components/public-shell'

export default function SavedPage(){return <PublicShell><section className="page-hero"><div className="container"><div className="eyebrow">Your shortlist</div><h1 className="heading" style={{marginTop:10}}>Saved properties</h1><p className="subheading">Keep the places you love together and compare them when you’re ready.</p></div></section><section className="section" style={{paddingTop:30}}><div className="container"><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}><Heart size={18} color="var(--primary)"/><strong>3 saved homes</strong></div><div className="property-grid">{properties.slice(0,3).map((p)=><PropertyCard key={p.id} property={p}/>)}</div></div></section></PublicShell>}
