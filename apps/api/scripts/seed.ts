import pg from 'pg'
import { appointments, leads, properties } from '@estatepilot/shared'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required')
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}})
try{
  await pool.query('create schema if not exists estatepilot')
  await pool.query('set search_path to estatepilot, public')
  await pool.query(await readFile(resolve('database/migrations/002_seed.sql'),'utf8'))
  for(const p of properties){
    const agentId=p.agent.avatar==='AK'?'agent-areeba':p.agent.avatar==='HS'?'agent-hamza':'agent-sara'
    await pool.query(`insert into properties(id,organization_id,slug,title,description,purpose,property_type,city,area,address,latitude,longitude,price,price_label,bedrooms,bathrooms,size,size_unit,furnished,amenities,status,verified,featured,match_score,agent_id) values($1,'org-demo',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) on conflict(id) do update set title=excluded.title,status=excluded.status,match_score=excluded.match_score`,[p.id,p.slug,p.title,p.description,p.purpose,p.type,p.city,p.area,p.address,p.latitude,p.longitude,p.price,p.priceLabel,p.bedrooms,p.bathrooms,p.size,p.sizeUnit,p.furnished,p.amenities,p.status,p.verified,p.featured,p.matchScore,agentId])
    for(const [position,url] of p.images.entries())await pool.query(`insert into property_images(organization_id,property_id,url,alt_text,position) select 'org-demo',$1,$2,$3,$4 where not exists(select 1 from property_images where property_id=$1 and position=$4)`,[p.id,url,p.title,position])
  }
  for(const l of leads){const agentId=l.assignedAgent.startsWith('Areeba')?'agent-areeba':l.assignedAgent.startsWith('Hamza')?'agent-hamza':l.assignedAgent.startsWith('Sara')?'agent-sara':null;await pool.query(`insert into leads(id,organization_id,name,email,phone,purpose,budget,preferred_area,score,temperature,stage,source,assigned_agent_id) values($1,'org-demo',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) on conflict(id) do update set stage=excluded.stage,score=excluded.score`,[l.id,l.name,l.email,l.phone,l.purpose,l.budget,l.area,l.score,l.temperature,l.stage,l.source,agentId])}
  for(const [index,a] of appointments.entries())await pool.query(`insert into appointments(id,organization_id,property_id,lead_name,agent_name,viewing_date,viewing_time,viewing_type,status) values($1,'org-demo',$2,$3,$4,$5,$6,$7,$8) on conflict(id) do update set status=excluded.status`,[a.id,properties[index%properties.length].id,a.leadName,a.agentName,a.date,a.time,a.type,a.status])
  console.log(`EstatePilot seeded: ${properties.length} properties, ${leads.length} leads, ${appointments.length} appointments`)
}finally{await pool.end()}
