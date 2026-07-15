import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './modules/app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))
  app.setGlobalPrefix('api')
  app.enableCors({ origin: (process.env.WEB_URL ?? 'http://localhost:3000').split(','), credentials: true, methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'] })
  app.enableShutdownHooks()
  await app.listen(Number(process.env.PORT ?? 4000), '0.0.0.0')
}
bootstrap().catch((error)=>{console.error(error);process.exit(1)})
