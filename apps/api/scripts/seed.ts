import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required')
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:undefined})
try{await pool.query(await readFile(resolve('database/migrations/002_seed.sql'),'utf8'));console.log('EstatePilot demo data seeded')}finally{await pool.end()}
