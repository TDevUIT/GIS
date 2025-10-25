'use client'

import { TileLayer } from 'react-leaflet'
import { MapLayer } from '@/types/map'

/**
 * MapLayers Component
 * 
 * Manages map tile layers from various providers with optimized configuration.
 * 
 * Available Providers:
 * - Street: OpenStreetMap standard view
 * - Satellite: Esri high-resolution imagery
 * - Dark: CARTO dark theme for night mode
 * - Light: CARTO light theme for clean look
 * - Terrain: Esri terrain with elevation data
 * - Topo: OpenTopoMap with topographic details
 * - Watercolor: Stamen artistic watercolor style
 */

interface MapLayersProps {
  activeLayer: MapLayer
}

// Map Provider Configuration
interface TileLayerConfig {
  url: string
  attribution: string
  maxZoom?: number
  subdomains?: string[]
}

const MAP_PROVIDERS: Record<MapLayer, TileLayerConfig> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  terrain: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 13,
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  watercolor: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 16,
  },
}

export default function MapLayers({ activeLayer }: MapLayersProps) {
  const layerConfig = MAP_PROVIDERS[activeLayer]

  if (!layerConfig) {
    console.warn(`Unknown map layer: ${activeLayer}`)
    return null
  }

  return (
    <TileLayer
      key={activeLayer}
      url={layerConfig.url}
      attribution={layerConfig.attribution}
      maxZoom={layerConfig.maxZoom}
      {...(layerConfig.subdomains && { subdomains: layerConfig.subdomains })}
    />
  )
}
