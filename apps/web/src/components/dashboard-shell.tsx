'use client'

import { BarChart3, Bell, Bot, Building2, CalendarDays, ChevronDown, CreditCard, FileText, Home, KanbanSquare, Menu, MessageSquare, Plug, Search, Settings, Users, Workflow, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button, Input } from './ui'

const nav=[
  ['Workspace',[['Overview','/dashboard',Home],['Leads','/dashboard/leads',Users],['Pipeline','/dashboard/pipeline',KanbanSquare],['Conversations','/dashboard/conversations',MessageSquare],['Properties','/dashboard/properties',Building2],['Appointments','/dashboard/appointments',CalendarDays]]],
  ['Automation',[['Follow-up workflows','/dashboard/workflows',Workflow],['Knowledge base','/dashboard/knowledge',FileText],['AI configuration','/dashboard/ai-settings',Bot]]],
  ['Management',[['Analytics','/dashboard/analytics',BarChart3],['Team members','/dashboard/team',Users],['Integrations','/dashboard/integrations',Plug],['Billing','/dashboard/billing',CreditCard],['Settings','/dashboard/settings',Settings]]]
] as const

function SidebarNav({onNavigate}:{onNavigate?:()=>void}){const path=usePathname();return <><Link href="/" className="brand"><span className="brand-mark" style={{background:'var(--lime)',color:'#173c2f'}}><Building2 size={19}/></span>EstatePilot AI</Link><nav className="sidebar-nav" aria-label="Dashboard navigation">{nav.map(([group,items])=><div key={group}><div className="sidebar-label">{group}</div>{items.map(([label,href,Icon])=><Link key={href} href={href} onClick={onNavigate} className={`sidebar-link ${path===href?'active':''}`}><Icon size={17}/><span>{label}</span></Link>)}</div>)}</nav></>}

export function DashboardShell({children}:{children:React.ReactNode}){const [mobile,setMobile]=useState(false);return <div className="dashboard-shell"><aside className="sidebar"><SidebarNav/></aside><div className="dashboard-main"><header className="dashboard-topbar"><div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}><Button variant="ghost" size="icon" className="mobile-menu-button" onClick={()=>setMobile(true)} aria-label="Open dashboard menu"><Menu size={20}/></Button><div style={{position:'relative',width:'min(360px,35vw)'}}><Search size={15} style={{position:'absolute',left:13,top:14,color:'var(--muted)'}}/><Input placeholder="Search leads, properties…" style={{paddingLeft:36,minHeight:40}}/></div></div><div style={{display:'flex',alignItems:'center',gap:8}}><Button variant="ghost" size="icon" aria-label="Notifications"><Bell size={18}/></Button><div className="person"><span className="avatar">AK</span><div className="desktop-only"><strong style={{fontSize:12}}>Areeba Khan</strong><div className="muted" style={{fontSize:10}}>Agency manager</div></div><ChevronDown size={14}/></div></div></header>{children}</div>{mobile&&<div style={{position:'fixed',inset:0,zIndex:80,background:'rgba(8,25,18,.45)'}} onClick={()=>setMobile(false)}><aside className="sidebar" style={{display:'block',width:280,position:'absolute',left:0,top:0}} onClick={(e)=>e.stopPropagation()}><Button variant="ghost" size="icon" style={{position:'absolute',right:10,top:10,color:'white'}} onClick={()=>setMobile(false)}><X/></Button><SidebarNav onNavigate={()=>setMobile(false)}/></aside></div>}</div>}
