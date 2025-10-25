'use client'

import { MapPin, Navigation, Layers } from 'lucide-react'

interface MapHeaderProps {
  onLayerToggle: () => void
}

export default function MapHeader({ onLayerToggle }: MapHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-4 pointer-events-auto border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Map Dashboard
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              TP. Hồ Chí Minh
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onLayerToggle}
        className="bg-white/95 backdrop-blur-md hover:bg-white p-3 rounded-xl shadow-lg transition-all pointer-events-auto hover:scale-105 border border-gray-200"
        title="Layers"
      >
        <Layers className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  )
}
