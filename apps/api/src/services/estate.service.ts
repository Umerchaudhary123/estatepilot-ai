import { Inject, Injectable } from '@nestjs/common'
import type { Property } from '@estatepilot/shared'
import { DatabaseService } from './database.service.js'
import { OpenRouterService } from './openrouter.service.js'

export function deterministicIntent(query:string){const q=query.toLowerCase();const city=['islamabad','lahore','karachi'].find((x)=>q.includes(x));const purpose=q.includes('rent')||q.includes('monthly')||q.includes('kiraye')?'rent':q.includes('buy')||q.includes('sale')||q.includes('crore')?'buy':undefined;const bedrooms=Number(q.match(/(\d+)\s*(?:bed|bedroom)/)?.[1]??0)||undefined;const furnished=q.includes('furnished')||q.includes('furnish');return{city,purpose,bedrooms,furnished:furnished||undefined}}
@Injectable()
export class EstateService {constructor(@Inject(DatabaseService) private db:DatabaseService,@Inject(OpenRouterService) private ai:OpenRouterService){}
  async search(query:string){const parsed=(await this.ai.extractSearch(query))??deterministicIntent(query);const all=await this.db.getProperties();const filtered=all.filter((p)=>{return(!parsed.city||p.city.toLowerCase()===parsed.city.toLowerCase())&&(!parsed.purpose||p.purpose===parsed.purpose)&&(!parsed.bedrooms||p.bedrooms>=parsed.bedrooms)&&(!parsed.furnished||p.furnished)});return{intent:parsed,properties:(filtered.length?filtered:all).sort((a,b)=>b.matchScore-a.matchScore),explanation:filtered.length?'Matches ranked by location, requirements and verified availability.':'No exact match; showing the closest verified alternatives.'}}
  async chat(message:string,language:'en'|'ur'){const all=await this.db.getProperties();const context=all.slice(0,6).map((p:Property)=>`${p.title}; ${p.area}, ${p.city}; ${p.priceLabel}; ${p.bedrooms} beds; ${p.status}`).join('\n');const reply=await this.ai.chat(message,language,context);return{reply:reply??(language==='ur'?'Main aap ke liye verified options dhoond sakta hoon. Shehar, budget, buy ya rent aur bedrooms bata dein.':'I can find verified options for you. Please share your city, budget, buy or rent, and preferred bedrooms.'),properties:all.slice(0,3)}}
}
