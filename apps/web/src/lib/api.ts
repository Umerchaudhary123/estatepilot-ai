import { appointments, leads, properties, type Appointment, type Lead, type Property } from '@estatepilot/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV==='production' ? 'https://estatepilot-ai-api.vercel.app/api' : 'http://localhost:4000/api')

async function request<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', 'x-demo-user': 'demo-manager', ...init?.headers }, next: { revalidate: 30 } })
    if (!response.ok) throw new Error(`API ${response.status}`)
    return await response.json() as T
  } catch { return fallback }
}

export const api = {
  properties: () => request<Property[]>('/properties', properties),
  property: (id: string) => request<Property | null>(`/properties/${id}`, properties.find((item) => item.id === id || item.slug === id) ?? null),
  leads: () => request<Lead[]>('/leads', leads),
  appointments: () => request<Appointment[]>('/appointments', appointments),
  chat: (message: string, language: 'en' | 'ur') => request('/ai/chat', { reply: language === 'ur' ? 'Main aap ke liye munasib properties dhoond raha hoon. Budget, shehar aur bedrooms share kar dein.' : 'I can find the right property for you. Share your city, budget and preferred bedrooms.', properties: properties.slice(0, 3) }, { method: 'POST', body: JSON.stringify({ message, language }) })
}
