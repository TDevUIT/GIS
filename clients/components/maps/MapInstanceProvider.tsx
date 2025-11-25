'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface MapInstanceProviderProps {
  onMapReady: (map: L.Map) => void
}

export default function MapInstanceProvider({ onMapReady }: MapInstanceProviderProps) {
  const map = useMap()

  useEffect(() => {
    if (map) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  return null
}
