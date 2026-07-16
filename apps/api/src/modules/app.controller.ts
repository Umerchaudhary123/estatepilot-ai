import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post, UnauthorizedException } from '@nestjs/common'
import { appointmentSchema, appointmentUpdateSchema, chatSchema, leadSchema, propertySchema, propertyStatusSchema, searchSchema, stageSchema } from '../schemas.js'
import { DatabaseService } from '../services/database.service.js'
import { EstateService } from '../services/estate.service.js'

@Controller()
export class AppController {constructor(@Inject(DatabaseService) private db:DatabaseService,@Inject(EstateService) private estate:EstateService){}
  @Get('health') health(){return{status:'ok',service:'estatepilot-api',database:this.db.isConnected()?'postgres':'seeded-demo',timestamp:new Date().toISOString()}}
  @Post('auth/login') async login(@Body()body:unknown){const input=body as {email?:unknown;password?:unknown}|null;if(!input||typeof input.email!=='string'||typeof input.password!=='string'||!input.email.trim()||input.password.length<1)throw new BadRequestException({error:'Email and password are required.'});const user=await this.db.authenticateUser(input.email,input.password);if(!user)throw new UnauthorizedException({error:'Email or password is incorrect.'});return{user}}
  @Get('properties') properties(){return this.db.getProperties()}
  @Get('properties/:id') property(@Param('id')id:string){return this.db.getProperty(id)}
  @Post('properties') async createProperty(@Body()body:unknown){const parsed=propertySchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.createProperty(parsed.data)}
  @Patch('properties/:id/status') async propertyStatus(@Param('id')id:string,@Body()body:unknown){const parsed=propertyStatusSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.updatePropertyStatus(id,parsed.data.status)}
  @Post('properties/search') async search(@Body()body:unknown){const parsed=searchSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.estate.search(parsed.data.query)}
  @Post('ai/chat') async chat(@Body()body:unknown){const parsed=chatSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.estate.chat(parsed.data.message,parsed.data.language)}
  @Get('leads') leads(){return this.db.getLeads()}
  @Post('leads') async createLead(@Body()body:unknown){const parsed=leadSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.createLead(parsed.data)}
  @Patch('leads/:id/stage') async moveLead(@Param('id')id:string,@Body()body:unknown){const parsed=stageSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.updateLeadStage(id,parsed.data.stage)}
  @Get('appointments') appointments(){return this.db.getAppointments()}
  @Post('appointments') async appointment(@Body()body:unknown){const parsed=appointmentSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.createAppointment(parsed.data)}
  @Patch('appointments/:id') async updateAppointment(@Param('id')id:string,@Body()body:unknown){const parsed=appointmentUpdateSchema.safeParse(body);if(!parsed.success)throw new BadRequestException(parsed.error.flatten());return this.db.updateAppointment(id,parsed.data)}
}
