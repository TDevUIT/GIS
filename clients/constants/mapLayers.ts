import { LayerOption } from '@/types/map'

export const LAYER_OPTIONS: LayerOption[] = [
  {
    id: 'street',
    name: 'Street Map',
    description: 'OpenStreetMap',
    gradient: 'from-green-400 to-blue-500',
    previewUrl: 'https://tile.openstreetmap.org/6/50/28.png',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'Esri World Imagery',
    gradient: 'from-blue-600 to-indigo-700',
    previewUrl: 'https://b.tile-cyclosm.openstreetmap.fr/cyclosm/6/50/29.png',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'CARTO Dark',
    gradient: 'from-gray-800 to-gray-900',
    previewUrl: 'https://b.tile.thunderforest.com/transport-dark/4/12/7@2x.png?apikey=6e5478c8a4f54c779f85573c0e399391',
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'CARTO Light',
    gradient: 'from-gray-100 to-gray-300',
    previewUrl: 'https://b.tile.thunderforest.com/cycle/6/50/29@2x.png?apikey=6e5478c8a4f54c779f85573c0e399391',
  },
  {
    id: 'topo',
    name: 'Topographic',
    description: 'OpenTopoMap',
    gradient: 'from-emerald-500 to-teal-600',
    previewUrl: 'https://b.tile-cyclosm.openstreetmap.fr/cyclosm/6/50/29.png',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Stamen Watercolor',
    gradient: 'from-rose-300 to-purple-400',
    previewUrl: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/6/51/30.png',
  },
]
