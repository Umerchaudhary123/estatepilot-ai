'use client'

import type { Property } from '@estatepilot/shared'
import { Bath, BedDouble, CheckCircle2, Heart, MapPin, Scale, Square } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { Badge, Button, Card } from './ui'

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const saved=useSyncExternalStore((notify)=>{window.addEventListener('estatepilot-saved-change',notify);window.addEventListener('storage',notify);return()=>{window.removeEventListener('estatepilot-saved-change',notify);window.removeEventListener('storage',notify)}},()=>{const ids=JSON.parse(localStorage.getItem('estatepilot-saved')??'[]') as string[];return ids.includes(property.id)},()=>false)
  function toggleSaved(){const ids=JSON.parse(localStorage.getItem('estatepilot-saved')??'[]') as string[];const next=ids.includes(property.id)?ids.filter((id)=>id!==property.id):[...ids,property.id];localStorage.setItem('estatepilot-saved',JSON.stringify(next));window.dispatchEvent(new Event('estatepilot-saved-change'))}
  return <Card className="property-card">
    <div className="property-image-wrap"><Image className="property-image" src={property.image} alt={`${property.title} in ${property.area}`} fill sizes="(max-width: 560px) 100vw, (max-width: 1050px) 50vw, 33vw"/>
      <div className="property-overlay"><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{property.verified&&<Badge tone="success"><CheckCircle2 size={11}/>Verified</Badge>}<Badge tone="brand">{property.matchScore}% match</Badge></div><Button variant="outline" size="icon" onClick={toggleSaved} aria-label={saved?'Remove saved property':'Save property'} style={{width:36,height:36,minHeight:36,color:saved?'#c64d4d':undefined}}><Heart size={16} fill={saved?'currentColor':'none'}/></Button></div>
    </div>
    <div className="property-body"><div className="property-location"><MapPin size={13}/>{property.area}, {property.city}</div><h3 className="property-title"><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3><div className="property-price">{property.priceLabel}</div>
      <div className="property-stats"><span><BedDouble size={14}/> {property.bedrooms} beds</span><span><Bath size={14}/> {property.bathrooms} baths</span><span><Square size={14}/> {property.size} {property.sizeUnit}</span></div>
      {!compact&&<div className="property-actions"><Link href={`/properties/${property.slug}`}><Button variant="outline" style={{width:'100%'}}>View details</Button></Link><Link href={`/compare?ids=${property.id}`}><Button variant="ghost" style={{width:'100%'}}><Scale size={15}/>Compare</Button></Link></div>}
    </div>
  </Card>
}
