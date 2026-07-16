import { createHmac, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE='estatepilot_session'
const demoUser={email:'manager@demo.estatepilot.pk',name:'Areeba Khan',role:'Agency manager'}
const secret=()=>process.env.AUTH_SECRET??'estatepilot-local-demo-secret'
const sign=(value:string)=>createHmac('sha256',secret()).update(value).digest('base64url')
export function validDemoCredentials(email:string,password:string){const expectedEmail=Buffer.from(demoUser.email);const enteredEmail=Buffer.from(email.toLowerCase());const expectedPassword=Buffer.from('EstatePilot2026!');const enteredPassword=Buffer.from(password);return expectedEmail.length===enteredEmail.length&&expectedPassword.length===enteredPassword.length&&timingSafeEqual(expectedEmail,enteredEmail)&&timingSafeEqual(expectedPassword,enteredPassword)}
export function createSession(){const payload=Buffer.from(JSON.stringify({email:demoUser.email,name:demoUser.name,role:demoUser.role,expires:Date.now()+7*86400000})).toString('base64url');return `${payload}.${sign(payload)}`}
export function verifySession(token?:string){if(!token)return null;const [payload,signature]=token.split('.');if(!payload||!signature||sign(payload)!==signature)return null;try{const session=JSON.parse(Buffer.from(payload,'base64url').toString()) as typeof demoUser&{expires:number};return session.expires>Date.now()?session:null}catch{return null}}
