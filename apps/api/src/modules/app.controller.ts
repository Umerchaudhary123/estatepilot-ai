import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common'
import { appointmentSchema, chatSchema, leadSchema, searchSchema, stageSchema } from '../schemas.js'
import { DatabaseService } from '../services/database.service.js'
import { EstateService } from '../services/estate.service.js'

@Controller()
export class AppController {constructor(@Inject(DatabaseService) private db:DatabaseService,@Inject(EstateService) private estate:EstateService){}
  @Get('health') health(){return{status:'ok',service:'estatepilot-api',database:this.db.isConnected()?'postgres':'seeded-demo',timestamp:new Date().toISOString()}}
  @Get('properties') properties(){return this.db.getProperties()}
  @Get('properties/:id') property(@Param('id')id:string){return this.db.getProperty(id)}
  @Post('properties/search') async search(@Body()body:unknown){const parsed=searchSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.estate.search(parsed.data.query)}
  @Post('ai/chat') async chat(@Body()body:unknown){const parsed=chatSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.estate.chat(parsed.data.message,parsed.data.language)}
  @Get('leads') leads(){return this.db.getLeads()}
  @Post('leads') async createLead(@Body()body:unknown){const parsed=leadSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.createLead(parsed.data)}
  @Patch('leads/:id/stage') async moveLead(@Param('id')id:string,@Body()body:unknown){const parsed=stageSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.updateLeadStage(id,parsed.data.stage)}
  @Get('appointments') appointments(){return this.db.getAppointments()}
  @Post('appointments') async appointment(@Body()body:unknown){const parsed=appointmentSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.createAppointment(parsed.data)}
}
