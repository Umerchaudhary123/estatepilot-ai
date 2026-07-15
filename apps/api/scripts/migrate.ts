import pg from 'pg'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required')
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:undefined})
try{for(const file of (await readdir(resolve('database/migrations'))).filter((x)=>x.endsWith('.sql')).sort()){console.log(`Applying ${file}`);await pool.query(await readFile(resolve('database/migrations',file),'utf8'))}}finally{await pool.end()}
