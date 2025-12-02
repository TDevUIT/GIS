'use client'

import { Info, X, Navigation } from 'lucide-react'
import { LocationData } from '@/types/map'

interface LocationInfoProps {
  location: LocationData | null
  onClose: () => void
}

export default function LocationInfo({ location, onClose }: LocationInfoProps) {
  if (!location) return null

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 border border-gray-200 animate-in slide-in-from-bottom">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{location.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Navigation className="w-3 h-3" />
              {location.address}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 leading-relaxed">{location.info}</p>
        <div className="mt-4 flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm py-3 px-4 rounded-xl transition-all hover:shadow-lg font-semibold">
            View Details
          </button>
          <button className="flex-1 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 text-sm py-3 px-4 rounded-xl transition-all font-semibold">
            Directions
          </button>
        </div>
      </div>
    </div>
  )
}
