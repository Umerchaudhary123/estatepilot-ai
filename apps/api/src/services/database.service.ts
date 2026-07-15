import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { appointments, leads, properties, type Appointment, type Lead, type LeadStage, type Property } from '@estatepilot/shared'
import pg from 'pg'
import { randomUUID } from 'node:crypto'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool | null = null
  private memory={properties:[...properties],leads:[...leads],appointments:[...appointments]}
  async onModuleInit(){if(!process.env.DATABASE_URL)return;this.pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:undefined,max:5});try{await this.pool.query('select 1')}catch(error){console.warn('Postgres unavailable; using seeded memory repository',error);await this.pool.end();this.pool=null}}
  async onModuleDestroy(){await this.pool?.end()}
  isConnected(){return Boolean(this.pool)}
  async getProperties(){return this.memory.properties}
  async getProperty(id:string){return this.memory.properties.find((p)=>p.id===id||p.slug===id)??null}
  async getLeads(){return this.memory.leads}
  async createLead(input:{name:string;email?:string;phone:string;purpose:'buy'|'rent';budget:string;area:string;source:string}){const lead:Lead={...input,email:input.email??'',id:`lead-${randomUUID().slice(0,8)}`,score:45,temperature:'warm',stage:'new',assignedAgent:'Unassigned',lastActivity:'Just now'};this.memory.leads.unshift(lead);if(this.pool)await this.pool.query('insert into leads(id, organization_id, name, email, phone, purpose, budget, preferred_area, score, temperature, stage, source) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[lead.id,'org-demo',lead.name,lead.email,lead.phone,lead.purpose,lead.budget,lead.area,lead.score,lead.temperature,lead.stage,lead.source]);return lead}
  async updateLeadStage(id:string,stage:LeadStage){const lead=this.memory.leads.find((l)=>l.id===id);if(!lead)return null;lead.stage=stage;lead.lastActivity='Just now';if(this.pool)await this.pool.query('update leads set stage=$1, updated_at=now() where id=$2',[stage,id]);return lead}
  async getAppointments(){return this.memory.appointments}
  async createAppointment(input:{propertyId:string;leadName:string;date:string;time:string;type:'physical'|'virtual'}){const property=this.memory.properties.find((p)=>p.id===input.propertyId)??this.memory.properties[0];const appointment:Appointment={id:`apt-${randomUUID().slice(0,8)}`,leadName:input.leadName,propertyTitle:property.title,agentName:property.agent.name,date:input.date,time:input.time,type:input.type,status:'pending'};this.memory.appointments.push(appointment);if(this.pool)await this.pool.query('insert into appointments(id, organization_id, property_id, lead_name, agent_name, viewing_date, viewing_time, viewing_type, status) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[appointment.id,'org-demo',property.id,appointment.leadName,appointment.agentName,appointment.date,appointment.time,appointment.type,appointment.status]);return appointment}
}
