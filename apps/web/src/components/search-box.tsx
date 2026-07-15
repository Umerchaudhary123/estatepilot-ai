'use client'

import { Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { Button, Card } from './ui'

const examples=['2 bed furnished near Blue Area','5 Marla house in DHA Lahore','Sea view apartment in Karachi']
export function SearchBox(){const [query,setQuery]=useState('');const router=useRouter();function submit(e?:FormEvent){e?.preventDefault();if(query.trim())router.push(`/properties?q=${encodeURIComponent(query.trim())}`)}return <div className="container search-panel"><form onSubmit={submit}><Card className="search-card"><div className="search-input-wrap"><Sparkles size={21} color="var(--primary)"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Tell us what you’re looking for — in English or Urdu" aria-label="Natural language property search"/></div><Button size="lg"><Search size={18}/>Find my property</Button></Card></form><div className="quick-searches"><span>Try:</span>{examples.map((x)=><button key={x} onClick={()=>{setQuery(x);router.push(`/properties?q=${encodeURIComponent(x)}`)}}>{x}</button>)}</div></div>}
