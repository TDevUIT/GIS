'use client'

import { useMap } from 'react-leaflet'
import { ZoomIn, ZoomOut, Home } from 'lucide-react'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/constants/mapLocations'

export default function ZoomControl() {
  const map = useMap()

  return (
    <div className="absolute left-6 bottom-32 z-[1000] flex flex-col">
      <div className="bg-white rounded-2xl border-2 border-white/50">
        <button
          onClick={() => map.zoomIn()}
          className="w-12 h-12 flex items-center justify-center hover:bg-blue-50 hover:rounded-2xl transition-all duration-200 ease-in-out group"
          title="Zoom in"
        >
          <ZoomIn className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-12 h-12 flex items-center justify-center hover:bg-blue-50 transition-all duration-200 ease-in-out group"
          title="Zoom out"
        >
          <ZoomOut className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
        </button>
        <button
          onClick={() => map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM)}
          className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out rounded-b-2xl"
          title="Reset view"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
