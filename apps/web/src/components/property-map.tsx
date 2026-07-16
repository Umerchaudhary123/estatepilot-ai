'use client'

import type { Property } from '@estatepilot/shared'
import { useEffect, useRef } from 'react'

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character)) }

export function PropertyMap({ properties }: { properties: Property[] }) {
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!element.current) return
    let disposed = false
    let map: { remove: () => void } | undefined

    async function renderMap() {
      const L = (await import('leaflet')).default
      if (disposed || !element.current) return
      const points = properties.map((property) => ({ property, location: [Number(property.latitude), Number(property.longitude)] as [number, number] })).filter(({ location }) => Number.isFinite(location[0]) && Number.isFinite(location[1]))
      const instance = L.map(element.current, { scrollWheelZoom: false, zoomControl: false }).setView([30.3753, 69.3451], 5)
      map = instance
      L.control.zoom({ position: 'topright' }).addTo(instance)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>' }).addTo(instance)
      points.forEach(({ property, location }) => {
        const directions = `https://www.google.com/maps/dir/?api=1&destination=${location[0]},${location[1]}`
        const popup = `<div class="listing-popup"><strong>${escapeHtml(property.title)}</strong><span>${escapeHtml(property.address)}</span><b>${escapeHtml(property.priceLabel)}</b><a href="${directions}" target="_blank" rel="noreferrer">Get directions ↗</a></div>`
        L.circleMarker(location, { radius: 9, color: '#ffffff', weight: 3, fillColor: '#0d6246', fillOpacity: 1 }).addTo(instance).bindPopup(popup, { autoPanPadding: [24, 24] })
      })
      const fitListings = () => {
        instance.invalidateSize()
        if (points.length > 1) instance.fitBounds(points.map(({ location }) => location), { padding: [36, 36], maxZoom: 11 })
        if (points.length === 1) instance.setView(points[0].location, 13)
      }
      instance.whenReady(() => requestAnimationFrame(fitListings))
      window.setTimeout(fitListings, 180)
    }

    void renderMap()
    return () => { disposed = true; map?.remove() }
  }, [properties])

  return <div className="map-shell"><div ref={element} className="free-property-map" aria-label="Interactive property map" /><div className="map-help">Click a green pin for the exact location and directions.</div></div>
}
