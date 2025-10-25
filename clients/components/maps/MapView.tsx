'use client'

import { MapContainer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'
import ZoomControl from '@/components/maps/ZoomControl'
import LayerPanel from '@/components/maps/LayerPanel'
import LocationInfo from '@/components/maps/LocationInfo'
import MapLayers from '@/components/maps/MapLayers'
import MapToolbar from '@/components/maps/MapToolbar'
import BackButton from '@/components/maps/BackButton'
import FeatureToolbar from '@/components/maps/FeatureToolbar'
import QuickAccessToolbar from '@/components/maps/QuickAccessToolbar'
import FeatureNotification from '@/components/maps/FeatureNotification'
import UnifiedBottomToolbar from '@/components/maps/UnifiedBottomToolbar'
import { LocationData, MapLayer } from '@/types/map'
import { MAP_LOCATIONS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/constants/mapLocations'
import { FeatureAction } from '@/constants/featureCategories'
import { Z_INDEX } from '@/constants/zIndex'
import { Layers } from 'lucide-react'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [activeLayer, setActiveLayer] = useState<MapLayer>('street')
  const [activeFeature, setActiveFeature] = useState<FeatureAction | null>(null)
  const [activeQuickAction, setActiveQuickAction] = useState<string | undefined>()

  const handleFeatureSelect = (action: FeatureAction) => {
    setActiveFeature(action)
    // TODO: Integrate with actual API service
    console.log('Selected feature:', action.name, 'Service:', action.service)
  }

  const handleQuickAction = (button: any) => {
    setActiveQuickAction(button.id)
    // TODO: Integrate with actual API service
    console.log('Quick action:', button.name, 'Service:', button.service)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapLayers activeLayer={activeLayer} />

        {MAP_LOCATIONS.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-base mb-1">{location.name}</h3>
                <p className="text-gray-600 mb-1">{location.address}</p>
                <p className="text-gray-500 text-xs">{location.info}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <ZoomControl />
        
        {/* Unified Bottom Toolbar - drawing, icons, and categories */}
        <UnifiedBottomToolbar />
      </MapContainer>

      <BackButton />
      <MapToolbar />

      {/* Quick Access Toolbar */}
      <QuickAccessToolbar 
        onQuickAction={handleQuickAction}
        activeButtonId={activeQuickAction}
      />

      {/* Feature Toolbar */}
      <FeatureToolbar onFeatureSelect={handleFeatureSelect} />

      {/* Layer Button */}
      <div className="absolute top-6 right-6 pointer-events-none" style={{ zIndex: Z_INDEX.LAYER_BUTTON }}>
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-lg shadow-md transition-all pointer-events-auto hover:shadow-lg border border-gray-200"
          title="Map Layers"
        >
          <Layers className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <LayerPanel
        isOpen={showLayerPanel}
        activeLayer={activeLayer}
        onClose={() => setShowLayerPanel(false)}
        onLayerChange={setActiveLayer}
      />

      <LocationInfo
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />

      {/* Feature Notification */}
      <FeatureNotification
        feature={activeFeature}
        onClose={() => setActiveFeature(null)}
      />
    </div>
  )
}
