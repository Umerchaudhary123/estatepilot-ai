import { createHmac } from 'node:crypto'
import type { SessionUser } from './permissions'

export type { SessionUser, WorkspaceRole } from './permissions'

export const SESSION_COOKIE='estatepilot_session'
const secret = () => {
  const configuredSecret = process.env.AUTH_SECRET

  if (!configuredSecret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET is not configured')
  }

  // Local development remains usable without committing a secret. Production
  // deployments must always receive AUTH_SECRET through Vercel.
  return configuredSecret ?? 'estatepilot-local-demo-secret'
}
const sign=(value:string)=>createHmac('sha256',secret()).update(value).digest('base64url')
export function createSession(user:SessionUser){const payload=Buffer.from(JSON.stringify({...user,expires:Date.now()+7*86400000})).toString('base64url');return `${payload}.${sign(payload)}`}
export function verifySession(token?:string){if(!token)return null;const [payload,signature]=token.split('.');if(!payload||!signature||sign(payload)!==signature)return null;try{const session=JSON.parse(Buffer.from(payload,'base64url').toString()) as SessionUser&{expires:number};return session.expires>Date.now()&&['manager','agent','support'].includes(session.role)?session:null}catch{return null}}
