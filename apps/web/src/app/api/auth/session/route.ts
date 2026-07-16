import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/auth'
export async function GET(){const session=verifySession((await cookies()).get(SESSION_COOKIE)?.value);return NextResponse.json({authenticated:Boolean(session),user:session&&{name:session.name,email:session.email,role:session.role}})}
