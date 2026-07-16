import { NextResponse } from 'next/server'
import { createSession, SESSION_COOKIE, type SessionUser } from '@/lib/auth'

const apiUrl=process.env.NEXT_PUBLIC_API_URL??(process.env.NODE_ENV==='production'?'https://estatepilot-ai-api.vercel.app/api':'http://localhost:4000/api')

export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as {email?:string;password?:string}|null
  if(!body||typeof body.email!=='string'||typeof body.password!=='string'||!body.email.trim()||!body.password)return NextResponse.json({error:'Enter a valid email and password.'},{status:400})
  try{
    const upstream=await fetch(`${apiUrl}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'})
    const data=await upstream.json().catch(()=>null) as {user?:SessionUser}|null
    if(!upstream.ok||!data?.user)return NextResponse.json({error:'Email or password is incorrect.'},{status:401})
    const response=NextResponse.json({ok:true,user:{name:data.user.name,role:data.user.role}})
    response.cookies.set(SESSION_COOKIE,createSession(data.user),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*86400})
    return response
  }catch{return NextResponse.json({error:'Sign-in service is unavailable. Please try again.'},{status:503})}
}
