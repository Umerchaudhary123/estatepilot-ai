import { properties } from '@estatepilot/shared'
import { Bath, BedDouble, Check, CheckCircle2, MapPin, Phone, Square } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AskAIButton, SharePropertyButton } from '@/components/property-actions'
import { PropertyMap } from '@/components/property-map'
import { PublicShell } from '@/components/public-shell'
import { Badge, Button, Card } from '@/components/ui'

export function generateStaticParams(){return properties.map((property)=>({slug:property.slug}))}
export default async function PropertyDetailPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const property=properties.find((item)=>item.slug===slug||item.id===slug);if(!property)notFound()
  const stats=[{Icon:BedDouble,value:property.bedrooms,label:'Bedrooms'},{Icon:Bath,value:property.bathrooms,label:'Bathrooms'},{Icon:Square,value:`${property.size} ${property.sizeUnit}`,label:'Area'},{Icon:Check,value:property.furnished?'Furnished':'Unfurnished',label:'Condition'}]
  return <PublicShell><section style={{padding:'35px 0 80px'}}><div className="container">
    <div style={{display:'flex',justifyContent:'space-between',gap:15,alignItems:'end',flexWrap:'wrap',marginBottom:22}}><div><div className="property-location"><MapPin size={14}/>{property.address} · {property.area}, {property.city}</div><h1 className="heading" style={{marginTop:9}}>{property.title}</h1><div style={{display:'flex',gap:7,marginTop:12}}><Badge tone="success"><CheckCircle2 size={12}/>Verified</Badge><Badge tone="brand">{property.matchScore}% AI match</Badge></div></div><SharePropertyButton title={property.title}/></div>
    <div className="gallery"><Image src={property.images[0]} alt={property.title} width={1200} height={800} priority/><div className="gallery-side">{property.images.slice(1,3).map((src,index)=><Image key={src} src={src} alt={`${property.title} view ${index+2}`} width={600} height={400}/>)}</div></div>
    <div className="detail-grid" style={{marginTop:30}}><div><div className="eyebrow">{property.purpose==='buy'?'For sale':'For rent'}</div><div className="property-price" style={{fontSize:30,marginTop:7}}>{property.priceLabel}</div><div className="detail-stats">{stats.map(({Icon,value,label})=><div className="detail-stat" key={label}><Icon size={19} color="var(--primary)"/><strong style={{display:'block',margin:'8px 0 3px',fontSize:14}}>{value}</strong><span className="muted" style={{fontSize:11}}>{label}</span></div>)}</div><h2 style={{marginTop:32}}>About this property</h2><p className="muted" style={{fontSize:16,lineHeight:1.8}}>{property.description}</p><h2 style={{marginTop:32}}>Amenities</h2><div className="amenity-grid">{property.amenities.map((amenity)=><div className="amenity" key={amenity}><CheckCircle2 size={16} color="var(--primary)"/>{amenity}</div>)}</div><h2 style={{marginTop:32}}>Location</h2><p className="property-location" style={{margin:'0 0 12px'}}><MapPin size={14}/>{property.address} · {property.area}, {property.city}</p><Card className="map-panel detail-map-panel"><PropertyMap properties={[property]}/></Card></div>
      <aside><Card className="detail-sidebar"><div className="person"><span className="avatar" style={{width:50,height:50}}>{property.agent.avatar}</span><div><strong>{property.agent.name}</strong><div className="muted" style={{fontSize:12,marginTop:3}}>{property.agent.title}</div></div></div><div style={{display:'grid',gap:9,marginTop:22}}><Link href={`/book-viewing?property=${property.id}`}><Button size="lg" style={{width:'100%'}}>Book a viewing</Button></Link><a href={`tel:${property.agent.phone}`}><Button variant="outline" style={{width:'100%'}}><Phone size={16}/>Call {property.agent.phone}</Button></a><AskAIButton title={property.title}/></div><p className="muted" style={{fontSize:11,lineHeight:1.5,marginBottom:0,marginTop:18}}>Availability is confirmed by the assigned agent before every viewing.</p></Card></aside>
    </div>
  </div></section></PublicShell>
}
