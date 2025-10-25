import { MapLayer } from '@/types/map'

export interface MapProviderInfo {
  id: MapLayer
  name: string
  provider: string
  description: string
  features: string[]
  maxZoom: number
  bestFor: string[]
  url: string
}

export const MAP_PROVIDER_INFO: Record<MapLayer, MapProviderInfo> = {
  street: {
    id: 'street',
    name: 'Street Map',
    provider: 'OpenStreetMap',
    description: 'Standard street map with detailed road networks and place names',
    features: ['Street names', 'Building outlines', 'Points of interest', 'Administrative boundaries'],
    maxZoom: 19,
    bestFor: ['Navigation', 'Route planning', 'General mapping'],
    url: 'https://www.openstreetmap.org',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Imagery',
    provider: 'Esri World Imagery',
    description: 'High-resolution satellite and aerial imagery from multiple sources',
    features: ['Aerial photos', 'High resolution', 'Recent imagery', 'Global coverage'],
    maxZoom: 18,
    bestFor: ['Land analysis', 'Environmental monitoring', 'Urban planning'],
    url: 'https://www.esri.com',
  },
  dark: {
    id: 'dark',
    name: 'Dark Theme',
    provider: 'CARTO',
    description: 'Dark-themed map perfect for night viewing and data visualization',
    features: ['Dark palette', 'Reduced eye strain', 'Data overlay friendly', 'Modern design'],
    maxZoom: 20,
    bestFor: ['Night mode', 'Data visualization', 'Dashboard displays'],
    url: 'https://carto.com',
  },
  light: {
    id: 'light',
    name: 'Light Theme',
    provider: 'CARTO',
    description: 'Clean, minimalist light-themed map with subtle colors',
    features: ['Minimal design', 'High contrast', 'Clean aesthetics', 'Print-friendly'],
    maxZoom: 20,
    bestFor: ['Professional presentations', 'Reports', 'Clean interfaces'],
    url: 'https://carto.com',
  },
  terrain: {
    id: 'terrain',
    name: 'Terrain Map',
    provider: 'Esri World Terrain',
    description: 'Topographic map showing elevation and terrain features',
    features: ['Elevation data', 'Terrain shading', 'Contour lines', 'Natural features'],
    maxZoom: 13,
    bestFor: ['Outdoor activities', 'Geographic analysis', 'Trail planning'],
    url: 'https://www.esri.com',
  },
  topo: {
    id: 'topo',
    name: 'Topographic',
    provider: 'OpenTopoMap',
    description: 'Detailed topographic map with contours and hiking trails',
    features: ['Contour lines', 'Hiking trails', 'Natural landmarks', 'Elevation markers'],
    maxZoom: 17,
    bestFor: ['Hiking', 'Mountain biking', 'Geographic education'],
    url: 'https://opentopomap.org',
  },
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor',
    provider: 'Stamen Design',
    description: 'Artistic watercolor-style map with painterly aesthetics',
    features: ['Artistic rendering', 'Unique style', 'Soft colors', 'Hand-drawn feel'],
    maxZoom: 16,
    bestFor: ['Creative projects', 'Presentations', 'Artistic displays'],
    url: 'https://www.stadiamaps.com',
  },
}

export const getProviderInfo = (layerId: MapLayer): MapProviderInfo => {
  return MAP_PROVIDER_INFO[layerId]
}


export const getAllProviders = (): MapProviderInfo[] => {
  return Object.values(MAP_PROVIDER_INFO)
}


export const getProvidersByUseCase = (useCase: string): MapProviderInfo[] => {
  return getAllProviders().filter(provider =>
    provider.bestFor.some(purpose =>
      purpose.toLowerCase().includes(useCase.toLowerCase())
    )
  )
}
