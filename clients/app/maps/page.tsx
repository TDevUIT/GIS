'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to prevent "window is not defined" error
// Leaflet requires the browser's window object
const MapView = dynamic(() => import('@/components/maps/MapView'), {
  ssr: false,
  loading: () => (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Maps() {
  return <MapView />
}
