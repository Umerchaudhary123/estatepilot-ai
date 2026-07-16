'use client'

import type { Property } from '@estatepilot/shared'
import { useEffect, useRef } from 'react'

export function PropertyMap({ properties }: { properties: Property[] }) {
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!element.current) return
    let disposed = false
    let map: { remove: () => void } | undefined

    async function renderMap() {
      const L = (await import('leaflet')).default
      if (disposed || !element.current) return
      const points = properties.filter((property) => Number.isFinite(property.latitude) && Number.isFinite(property.longitude))
      const center: [number, number] = points.length
        ? [points.reduce((sum, property) => sum + property.latitude, 0) / points.length, points.reduce((sum, property) => sum + property.longitude, 0) / points.length]
        : [30.3753, 69.3451]
      const instance = L.map(element.current, { scrollWheelZoom: false, zoomControl: false }).setView(center, points.length > 1 ? 6 : 11)
      map = instance
      L.control.zoom({ position: 'bottomright' }).addTo(instance)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>' }).addTo(instance)
      const bounds: [number, number][] = []
      points.forEach((property, index) => {
        const location: [number, number] = [property.latitude, property.longitude]
        bounds.push(location)
        const icon = L.divIcon({ className: 'listing-marker', html: `<span>${index + 1}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] })
        L.marker(location, { icon }).addTo(instance).bindPopup(`<strong>${property.title}</strong><br/>${property.area}, ${property.city}<br/><b>${property.priceLabel}</b>`)
      })
      if (bounds.length > 1) instance.fitBounds(bounds, { padding: [32, 32], maxZoom: 11 })
    }

    void renderMap()
    return () => { disposed = true; map?.remove() }
  }, [properties])

  return <div ref={element} className="free-property-map" aria-label="Interactive property map" />
}
