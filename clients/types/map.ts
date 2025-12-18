export interface LocationData {
  name: string
  address: string
  info: string
  coordinates: [number, number]
}

export type MapLayer =
  | 'street'
  | 'satellite'
  | 'dark'
  | 'light'
  | 'terrain'
  | 'topo'
  | 'watercolor'

export interface LayerOption {
  id: MapLayer
  name: string
  description: string
  gradient: string
  previewUrl?: string
}
