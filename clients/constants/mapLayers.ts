import { LayerOption } from '@/types/map'

export const LAYER_OPTIONS: LayerOption[] = [
  {
    id: 'street',
    name: 'Street Map',
    description: 'OpenStreetMap',
    gradient: 'from-green-400 to-blue-500',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'Esri World Imagery',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'CARTO Dark',
    gradient: 'from-gray-800 to-gray-900',
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'CARTO Light',
    gradient: 'from-gray-100 to-gray-300',
  },
  {
    id: 'terrain',
    name: 'Terrain',
    description: 'Esri World Terrain',
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'topo',
    name: 'Topographic',
    description: 'OpenTopoMap',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Stamen Watercolor',
    gradient: 'from-rose-300 to-purple-400',
  },
]
