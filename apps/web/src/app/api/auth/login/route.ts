import { NextResponse } from 'next/server'
import { createSession, SESSION_COOKIE, validDemoCredentials } from '@/lib/auth'

export async function POST(request:Request){const body=await request.json().catch(()=>null) as {email?:string,password?:string}|null;if(!body||!validDemoCredentials(body.email??'',body.password??''))return NextResponse.json({error:'Email or password is incorrect.'},{status:401});const response=NextResponse.json({ok:true});response.cookies.set(SESSION_COOKIE,createSession(),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*86400});return response}
