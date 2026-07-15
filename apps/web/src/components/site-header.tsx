'use client'

import Link from 'next/link'
import { Building2, Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui'

const links = [['Properties','/properties'],['Buy','/properties?purpose=buy'],['Rent','/properties?purpose=rent'],['Agents','/#agents'],['About','/#about']]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'اردو'>('EN')
  return <header className="site-header">
    <div className="container nav">
      <Link href="/" className="brand" aria-label="EstatePilot AI home"><span className="brand-mark"><Building2 size={19}/></span><span>EstatePilot <span style={{color:'var(--primary)'}}>AI</span></span></Link>
      <nav className="nav-links" aria-label="Primary navigation">{links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="nav-actions">
        <Button variant="ghost" size="sm" onClick={()=>setLanguage(language === 'EN' ? 'اردو' : 'EN')} aria-label="Switch language"><Languages size={16}/>{language}</Button>
        <Link href="/auth" className="desktop-only"><Button variant="ghost" size="sm">Sign in</Button></Link>
        <Link href="/dashboard" className="desktop-only"><Button size="sm">Agency dashboard</Button></Link>
        <Button variant="outline" size="icon" className="mobile-menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open?<X size={20}/>:<Menu size={20}/>}</Button>
      </div>
    </div>
    {open && <nav className="mobile-drawer" aria-label="Mobile navigation">{links.map(([label,href])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/auth" onClick={()=>setOpen(false)}>Sign in</Link><Link href="/dashboard" onClick={()=>setOpen(false)} style={{background:'var(--primary)',color:'white'}}>Agency dashboard</Link></nav>}
  </header>
}
