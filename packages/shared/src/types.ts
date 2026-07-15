export type ListingPurpose = 'buy' | 'rent'
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented'
export type LeadStage = 'new' | 'qualified' | 'viewing' | 'negotiation' | 'won' | 'lost'

export interface Property {
  id: string
  slug: string
  title: string
  purpose: ListingPurpose
  type: 'house' | 'apartment' | 'plot' | 'commercial'
  city: string
  area: string
  address: string
  price: number
  currency: 'PKR'
  priceLabel: string
  bedrooms: number
  bathrooms: number
  size: number
  sizeUnit: 'Marla' | 'Kanal' | 'Sq. Ft.' | 'Sq. Yd.'
  furnished: boolean
  verified: boolean
  featured: boolean
  status: PropertyStatus
  matchScore: number
  description: string
  amenities: string[]
  image: string
  images: string[]
  latitude: number
  longitude: number
  agent: { name: string; title: string; phone: string; avatar: string }
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  purpose: ListingPurpose
  budget: string
  area: string
  score: number
  temperature: 'hot' | 'warm' | 'cold'
  stage: LeadStage
  assignedAgent: string
  lastActivity: string
  source: string
}

export interface Appointment {
  id: string
  leadName: string
  propertyTitle: string
  agentName: string
  date: string
  time: string
  type: 'physical' | 'virtual'
  status: 'confirmed' | 'pending' | 'cancelled'
}
