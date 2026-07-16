'use client'

import { FormEvent, useState } from 'react'
import { Button, Input } from './ui'

export function LoginForm(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  async function submit(event:FormEvent){event.preventDefault();setLoading(true);setError('');try{const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});if(!response.ok){const result=await response.json().catch(()=>({error:'Unable to sign in.'}));throw new Error(result.error)}window.location.assign('/dashboard')}catch(cause){setError(cause instanceof Error?cause.message:'Unable to sign in. Please try again.');setLoading(false)}}
  return <form className="form-grid" style={{marginTop:24}} onSubmit={submit}><div className="form-field"><label htmlFor="email">Work email</label><Input id="email" type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required autoComplete="email" placeholder="name@agency.pk"/></div><div className="form-field"><label htmlFor="password">Password</label><Input id="password" type="password" value={password} onChange={(event)=>setPassword(event.target.value)} required autoComplete="current-password" placeholder="Enter your password"/></div><div style={{display:'flex',justifyContent:'space-between',fontSize:12}}><label><input type="checkbox" defaultChecked/> Remember me</label><span className="muted">Agency workspace</span></div>{error&&<div role="alert" style={{color:'#9b312a',background:'#fee8e5',padding:10,borderRadius:9,fontSize:12}}>{error}</div>}<Button size="lg" type="submit" disabled={loading}>{loading?'Signing in…':'Sign in to workspace'}</Button></form>
}
