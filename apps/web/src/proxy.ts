import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request:NextRequest){if(!request.cookies.has('estatepilot_session'))return NextResponse.redirect(new URL('/auth',request.url));return NextResponse.next()}
export const config={matcher:['/dashboard/:path*']}
