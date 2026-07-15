import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'EstatePilot AI — Pakistan Property, Smarter', template: '%s | EstatePilot AI' },
  description: 'AI-powered property discovery, viewings and real-estate CRM for Pakistan.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: { title: 'EstatePilot AI', description: 'Pakistan property, powered by intelligent guidance.', type: 'website' }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
