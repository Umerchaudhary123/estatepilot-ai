'use client'

import type { Property } from '@estatepilot/shared'
import { Bot, Languages, MapPin, MessageCircle, Send, X } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button, Input } from './ui'

type Message = { role: 'ai' | 'user'; text: string; properties?: Property[] }

export function AIChat() {
  const [open,setOpen]=useState(false)
  const [language,setLanguage]=useState<'en'|'ur'>('en')
  const [input,setInput]=useState('')
  const [loading,setLoading]=useState(false)
  const [messages,setMessages]=useState<Message[]>([{role:'ai',text:'Assalam-o-Alaikum! I’m your EstatePilot assistant. Tell me where and what kind of property you need.'}])
  useEffect(()=>{const openChat=(event:Event)=>{setOpen(true);setInput((event as CustomEvent<string>).detail??'')};window.addEventListener('estatepilot-open-chat',openChat);return()=>window.removeEventListener('estatepilot-open-chat',openChat)},[])
  async function submit(event:FormEvent){event.preventDefault();const value=input.trim();if(!value)return;const history=messages.filter((message)=>message.role==='user').slice(-3).map((message)=>message.text).join('. ');const query=history?`${history}. ${value}`:value;setMessages((m)=>[...m,{role:'user',text:value}]);setInput('');setLoading(true);try{const result=await api.chat(query,language) as {reply:string;properties?:Property[]};setMessages((m)=>[...m,{role:'ai',text:result.reply,properties:result.properties}])}catch{setMessages((m)=>[...m,{role:'ai',text:'I could not reach the property service. Please try again.'}])}finally{setLoading(false)}}
  return <>{open&&<section className="chat-window" aria-label="AI property assistant"><div className="chat-head"><div style={{display:'flex',alignItems:'center',gap:10}}><span className="brand-mark" style={{background:'var(--lime)',color:'#173c2f'}}><Bot size={19}/></span><div><strong>EstatePilot Assistant</strong><div style={{fontSize:11,color:'#b8c9c1'}}>Online · Free AI model</div></div></div><div style={{display:'flex'}}><Button variant="ghost" size="icon" style={{color:'white'}} onClick={()=>setLanguage(language==='en'?'ur':'en')} aria-label="Change chat language"><Languages size={17}/></Button><Button variant="ghost" size="icon" style={{color:'white'}} onClick={()=>setOpen(false)} aria-label="Close chat"><X size={18}/></Button></div></div><div className="chat-body" aria-live="polite">{messages.map((m,i)=><div key={i} className={`message ${m.role}`}><div>{m.text}</div>{m.properties?.map((property)=><Link className="chat-property" href={`/properties/${property.slug}`} key={property.id}><MapPin size={13}/><span><strong>{property.title}</strong><small>{property.area}, {property.city} · {property.priceLabel}</small></span></Link>)}</div>)}{loading&&<div className="message ai">Thinking…</div>}</div><form className="chat-form" onSubmit={submit}><Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder={language==='ur'?'Apni property requirement likhein…':'Describe your ideal property…'} aria-label="Message"/><Button size="icon" aria-label="Send message" disabled={loading}><Send size={18}/></Button></form></section>}<button className="chat-launcher" onClick={()=>setOpen(!open)} aria-label={open?'Close AI assistant':'Open AI assistant'}>{open?<X/>:<MessageCircle/>}</button></>
}
