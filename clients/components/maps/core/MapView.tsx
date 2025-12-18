'use client'

import { MapContainer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import ZoomControl from '@/components/maps/controls/ZoomControl'
import LayerPanel from '@/components/maps/controls/LayerPanel'
import LocationInfo from '@/components/maps/search/LocationInfo'
import MapLayers from '@/components/maps/core/MapLayers'
import MapToolbar from '@/components/maps/controls/MapToolbar'
import BackButton from '@/components/maps/controls/BackButton'
import FeatureNotification from '@/components/maps/ui/FeatureNotification'
import UnifiedBottomToolbar from '@/components/maps/controls/UnifiedBottomToolbar'
import MapInstanceProvider from '@/components/maps/core/MapInstanceProvider'
import DistrictMap from '@/components/maps/features/DistrictMap'
import WardMap from '@/components/maps/features/WardMap'
import TrafficMap from '@/components/maps/features/TrafficMap'
import AirQualityMap from '@/components/maps/features/AirQualityMap'
import WaterQualityMap from '@/components/maps/features/WaterQualityMap'
import InfrastructureMap from '@/components/maps/features/InfrastructureMap'
import LandUseMap from '@/components/maps/features/LandUseMap'
import PopulationMap from '@/components/maps/features/PopulationMap'
import PublicTransportMap from '@/components/maps/features/PublicTransportMap'
import TerrainMap from '@/components/maps/features/TerrainMap'
import UrbanPlanMap from '@/components/maps/features/UrbanPlanMap'
import AnalyticsPanel from '@/components/maps/panels/AnalyticsPanel'
import { MAP_LOCATIONS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/constants/mapLocations'
import { useMapState } from '@/hooks/map/useMapState'
import LayerControlGroup from '@/components/maps/controls/LayerControlGroup'
import MapInfoPanels from '@/components/maps/panels/MapInfoPanels'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

export default function MapView() {
  const {
    currentLocation,
    selectedLocation, setSelectedLocation,
    selectedDistrict, setSelectedDistrict,
    selectedWard, setSelectedWard,
    selectedRoad, setSelectedRoad,

    showDistrictsLayer, setShowDistrictsLayer,
    showWardsLayer, setShowWardsLayer,
    showTrafficLayer, setShowTrafficLayer,
    showAirQualityLayer, setShowAirQualityLayer,
    showWaterQualityLayer, setShowWaterQualityLayer,
    showInfrastructureLayer, setShowInfrastructureLayer,
    showLandUseLayer, setShowLandUseLayer,
    showPopulationLayer, setShowPopulationLayer,
    showPublicTransportLayer, setShowPublicTransportLayer,
    showTerrainLayer, setShowTerrainLayer,
    showUrbanPlanLayer, setShowUrbanPlanLayer,

    showLayerPanel, setShowLayerPanel,
    showAnalyticsPanel, setShowAnalyticsPanel,
    activeLayer, setActiveLayer,
    setMapInstance,
    activeFeature, setActiveFeature,

    handleDistrictClick,
    handleWardClick,
    handleRoadClick,
    handleAirQualityClick,
    handleWaterQualityClick,
    handleInfrastructureClick,
    handleLandUseClick,
    handlePopulationClick,
    handlePublicTransportClick,
    handleTerrainClick,
    handleUrbanPlanClick,
    handleLocationFound,
  } = useMapState()

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapInstanceProvider onMapReady={setMapInstance} />
        <MapLayers activeLayer={activeLayer} />

        {showDistrictsLayer && !showWardsLayer && (
          <DistrictMap
            onDistrictClick={handleDistrictClick}
            highlightedDistrictId={selectedDistrict?.id}
            showLabels={true}
          />
        )}

        {showWardsLayer && (
          <WardMap
            districtId={selectedDistrict?.id}
            onWardClick={handleWardClick}
            highlightedWardId={selectedWard?.id}
            showLabels={true}
          />
        )}

        {/* {showAccidentsLayer && (
          <AccidentMap
            onAccidentClick={handleAccidentClick}
          />
        )} */}

        {showTrafficLayer && (
          <TrafficMap
            onRoadClick={handleRoadClick}
            autoRefresh={true}
            refreshInterval={30000}
          />
        )}

        {showAirQualityLayer && (
          <AirQualityMap
            onPointClick={handleAirQualityClick}
          />
        )}

        {showWaterQualityLayer && (
          <WaterQualityMap
            onPointClick={handleWaterQualityClick}
          />
        )}

        {showInfrastructureLayer && (
          <InfrastructureMap
            onPointClick={handleInfrastructureClick}
          />
        )}

        {showLandUseLayer && (
          <LandUseMap
            onPolygonClick={handleLandUseClick}
          />
        )}

        {showPopulationLayer && (
          <PopulationMap
            onPointClick={handlePopulationClick}
          />
        )}

        {showPublicTransportLayer && (
          <PublicTransportMap
            onRouteClick={handlePublicTransportClick}
          />
        )}

        {showTerrainLayer && (
          <TerrainMap
            onPolygonClick={handleTerrainClick}
          />
        )}

        {showUrbanPlanLayer && (
          <UrbanPlanMap
            onPolygonClick={handleUrbanPlanClick}
          />
        )}

        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={currentLocationIcon}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-base mb-1">📍 Vị trí của bạn</h3>
                <p className="text-gray-600 mb-1">Lat: {currentLocation[0].toFixed(6)}</p>
                <p className="text-gray-600">Lng: {currentLocation[1].toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}

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

        <ZoomControl onLocationFound={handleLocationFound} />
        <UnifiedBottomToolbar />
      </MapContainer>

      <BackButton />
      <MapToolbar />

      <LayerControlGroup
        showLayerPanel={showLayerPanel}
        setShowLayerPanel={setShowLayerPanel}
        showAnalyticsPanel={showAnalyticsPanel}
        setShowAnalyticsPanel={setShowAnalyticsPanel}
        showDistrictsLayer={showDistrictsLayer}
        setShowDistrictsLayer={setShowDistrictsLayer}
        showTrafficLayer={showTrafficLayer}
        setShowTrafficLayer={setShowTrafficLayer}
        showAirQualityLayer={showAirQualityLayer}
        setShowAirQualityLayer={setShowAirQualityLayer}
        showWaterQualityLayer={showWaterQualityLayer}
        setShowWaterQualityLayer={setShowWaterQualityLayer}
        showInfrastructureLayer={showInfrastructureLayer}
        setShowInfrastructureLayer={setShowInfrastructureLayer}
        showLandUseLayer={showLandUseLayer}
        setShowLandUseLayer={setShowLandUseLayer}
        showPopulationLayer={showPopulationLayer}
        setShowPopulationLayer={setShowPopulationLayer}
        showPublicTransportLayer={showPublicTransportLayer}
        setShowPublicTransportLayer={setShowPublicTransportLayer}
        showTerrainLayer={showTerrainLayer}
        setShowTerrainLayer={setShowTerrainLayer}
        showUrbanPlanLayer={showUrbanPlanLayer}
        setShowUrbanPlanLayer={setShowUrbanPlanLayer}
      />

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

      <MapInfoPanels
        showWardsLayer={showWardsLayer}
        setShowWardsLayer={setShowWardsLayer}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}

        selectedRoad={selectedRoad}
        setSelectedRoad={setSelectedRoad}
        showTrafficLayer={showTrafficLayer}
      />

      {showAnalyticsPanel && (
        <AnalyticsPanel onClose={() => setShowAnalyticsPanel(false)} />
      )}

      <FeatureNotification
        feature={activeFeature}
        onClose={() => setActiveFeature(null)}
      />
    </div>
  )
}
