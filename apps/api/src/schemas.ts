import { z } from 'zod'

export const searchSchema=z.object({query:z.string().min(2).max(500),purpose:z.enum(['buy','rent']).optional(),city:z.string().max(80).optional()})
export const chatSchema=z.object({message:z.string().min(1).max(2000),language:z.enum(['en','ur']).default('en'),conversationId:z.string().optional()})
export const leadSchema=z.object({name:z.string().min(2),email:z.email().optional(),phone:z.string().min(10),purpose:z.enum(['buy','rent']),budget:z.string(),area:z.string(),source:z.string().default('Website')})
export const stageSchema=z.object({stage:z.enum(['new','qualified','viewing','negotiation','won','lost'])})
export const appointmentSchema=z.object({propertyId:z.string(),leadName:z.string().min(2),email:z.email().optional(),phone:z.string().optional(),date:z.string(),time:z.string(),type:z.enum(['physical','virtual']).default('physical'),notes:z.string().max(1000).optional()})
