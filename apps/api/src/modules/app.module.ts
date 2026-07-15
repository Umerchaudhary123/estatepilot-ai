import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { DatabaseService } from '../services/database.service.js'
import { OpenRouterService } from '../services/openrouter.service.js'
import { EstateService } from '../services/estate.service.js'

@Module({ controllers:[AppController], providers:[DatabaseService,OpenRouterService,EstateService] })
export class AppModule {}
