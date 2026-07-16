import { createHmac } from 'node:crypto'
import type { SessionUser } from './permissions'

export type { SessionUser, WorkspaceRole } from './permissions'

export const SESSION_COOKIE='estatepilot_session'
const secret=()=>process.env.AUTH_SECRET??'estatepilot-local-demo-secret'
const sign=(value:string)=>createHmac('sha256',secret()).update(value).digest('base64url')
export function createSession(user:SessionUser){const payload=Buffer.from(JSON.stringify({...user,expires:Date.now()+7*86400000})).toString('base64url');return `${payload}.${sign(payload)}`}
export function verifySession(token?:string){if(!token)return null;const [payload,signature]=token.split('.');if(!payload||!signature||sign(payload)!==signature)return null;try{const session=JSON.parse(Buffer.from(payload,'base64url').toString()) as SessionUser&{expires:number};return session.expires>Date.now()&&['manager','agent','support'].includes(session.role)?session:null}catch{return null}}
