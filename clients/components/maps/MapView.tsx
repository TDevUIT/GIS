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
import MapSearchBar from '@/components/maps/MapSearchBar'
import MapInstanceProvider from '@/components/maps/MapInstanceProvider'
import DistrictMap from '@/components/maps/DistrictMap'
import WardMap from '@/components/maps/WardMap'
import AccidentMap from '@/components/maps/AccidentMap'
import TrafficMap from '@/components/maps/TrafficMap'
import AirQualityMap from '@/components/maps/AirQualityMap'
import WaterQualityMap from '@/components/maps/WaterQualityMap'
import InfrastructureMap from '@/components/maps/InfrastructureMap'
import LandUseMap from '@/components/maps/LandUseMap'
import PopulationMap from '@/components/maps/PopulationMap'
import PublicTransportMap from '@/components/maps/PublicTransportMap'
import TerrainMap from '@/components/maps/TerrainMap'
import UrbanPlanMap from '@/components/maps/UrbanPlanMap'
import AnalyticsPanel from '@/components/maps/AnalyticsPanel'
import { LocationData, MapLayer } from '@/types/map'
import { DistrictGeoJSON, WardGeoJSON, AccidentPoint, TrafficLine } from '@/types'
import { AirQualityPoint } from '@/utils/airQualityHelpers'
import { WaterQualityPoint } from '@/utils/waterQualityHelpers'
import { InfrastructurePoint } from '@/utils/infrastructureHelpers'
import { LandUsePolygon } from '@/utils/landUseHelpers'
import { PopulationPoint } from '@/utils/populationHelpers'
import { PublicTransportRoute } from '@/utils/publicTransportHelpers'
import { TerrainPolygon } from '@/utils/terrainHelpers'
import { UrbanPlanPolygon } from '@/utils/urbanPlanHelpers'
import { MAP_LOCATIONS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/constants/mapLocations'
import { FeatureAction } from '@/constants/featureCategories'
import { Z_INDEX } from '@/constants/zIndex'
import { Layers, AlertTriangle, Activity, Wind, Droplets, Building2, Map as MapIcon, Users, Bus, Mountain, FileText, BarChart3, MapPin } from 'lucide-react'
import { getCongestionLabel } from '@/utils/trafficHelpers'
import { GeocodingResult } from '@/services/geocodingService'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icon for current location
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

// Custom icon for search result
const searchResultIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

export default function MapView() {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictGeoJSON | null>(null)
  const [selectedWard, setSelectedWard] = useState<WardGeoJSON | null>(null)
  const [selectedAccident, setSelectedAccident] = useState<AccidentPoint | null>(null)
  const [selectedRoad, setSelectedRoad] = useState<TrafficLine | null>(null)
  const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityPoint | null>(null)
  const [selectedWaterQuality, setSelectedWaterQuality] = useState<WaterQualityPoint | null>(null)
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<InfrastructurePoint | null>(null)
  const [selectedLandUse, setSelectedLandUse] = useState<LandUsePolygon | null>(null)
  const [selectedPopulation, setSelectedPopulation] = useState<PopulationPoint | null>(null)
  const [selectedPublicTransport, setSelectedPublicTransport] = useState<PublicTransportRoute | null>(null)
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainPolygon | null>(null)
  const [selectedUrbanPlan, setSelectedUrbanPlan] = useState<UrbanPlanPolygon | null>(null)
  const [showDistrictsLayer, setShowDistrictsLayer] = useState(false)
  const [showWardsLayer, setShowWardsLayer] = useState(false)
  const [showAccidentsLayer, setShowAccidentsLayer] = useState(false)
  const [showTrafficLayer, setShowTrafficLayer] = useState(false)
  const [showAirQualityLayer, setShowAirQualityLayer] = useState(false)
  const [showWaterQualityLayer, setShowWaterQualityLayer] = useState(false)
  const [showInfrastructureLayer, setShowInfrastructureLayer] = useState(false)
  const [showLandUseLayer, setShowLandUseLayer] = useState(false)
  const [showPopulationLayer, setShowPopulationLayer] = useState(false)
  const [showPublicTransportLayer, setShowPublicTransportLayer] = useState(false)
  const [showTerrainLayer, setShowTerrainLayer] = useState(false)
  const [showUrbanPlanLayer, setShowUrbanPlanLayer] = useState(false)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false)
  const [activeLayer, setActiveLayer] = useState<MapLayer>('street')
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null)
  const [searchResult, setSearchResult] = useState<GeocodingResult | null>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [activeFeature, setActiveFeature] = useState<FeatureAction | null>(null)
  const [activeQuickAction, setActiveQuickAction] = useState<string | undefined>()

  const handleFeatureSelect = (action: FeatureAction) => {
    setActiveFeature(action)
    console.log('Selected feature:', action.name, 'Service:', action.service)
  }

  const handleQuickAction = (button: any) => {
    setActiveQuickAction(button.id)
    console.log('Quick action:', button.name, 'Service:', button.service)
  }

  const handleDistrictClick = (district: DistrictGeoJSON) => {
    setSelectedDistrict(district)
    setShowWardsLayer(true)
    console.log('Selected district:', district.properties.name)
  }

  const handleWardClick = (ward: WardGeoJSON) => {
    setSelectedWard(ward)
    console.log('Selected ward:', ward.properties.name)
  }

  const handleAccidentClick = (accident: AccidentPoint) => {
    setSelectedAccident(accident)
    console.log('Selected accident:', accident.roadName)
  }

  const handleRoadClick = (road: TrafficLine) => {
    setSelectedRoad(road)
    console.log('Selected road:', road.roadName)
  }

  const handleAirQualityClick = (point: AirQualityPoint) => {
    setSelectedAirQuality(point)
    console.log('Selected air quality:', point.districtName, point.level)
  }

  const handleWaterQualityClick = (point: WaterQualityPoint) => {
    setSelectedWaterQuality(point)
    console.log('Selected water quality:', point.sourceName, point.quality)
  }

  const handleInfrastructureClick = (point: InfrastructurePoint) => {
    setSelectedInfrastructure(point)
    console.log('Selected infrastructure:', point.name, point.category)
  }

  const handleLandUseClick = (polygon: LandUsePolygon) => {
    setSelectedLandUse(polygon)
    console.log('Selected land use:', polygon.type, polygon.area)
  }

  const handlePopulationClick = (point: PopulationPoint) => {
    setSelectedPopulation(point)
    console.log('Selected population:', point.districtName, point.density)
  }

  const handlePublicTransportClick = (route: PublicTransportRoute) => {
    setSelectedPublicTransport(route)
    console.log('Selected public transport:', route.routeName, route.mode)
  }

  const handleTerrainClick = (polygon: TerrainPolygon) => {
    setSelectedTerrain(polygon)
    console.log('Selected terrain:', polygon.elevation, polygon.slope)
  }

  const handleUrbanPlanClick = (urbanPlan: UrbanPlanPolygon) => {
    setSelectedUrbanPlan(urbanPlan)
    console.log('Selected urban plan:', urbanPlan.planName)
  }

  const handleLocationFound = (lat: number, lng: number) => {
    setCurrentLocation([lat, lng])
    console.log('Current location:', lat, lng)
  }

  const handleLocationSelect = (result: GeocodingResult) => {
    const coords: [number, number] = [result.lat, result.lon]
    setSearchMarker(coords)
    setSearchResult(result)
    console.log('Selected location:', result.display_name)
  }

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCurrentLocation([lat, lng])
          console.log('Current location found:', lat, lng)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Không thể lấy vị trí hiện tại')
        }
      )
    } else {
      alert('Trình duyệt không hỗ trợ geolocation')
    }
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

        {showAccidentsLayer && (
          <AccidentMap
            onAccidentClick={handleAccidentClick}
          />
        )}

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

        {/* Current Location Marker */}
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

        {/* Search Result Marker */}
        {searchMarker && searchResult && (
          <Marker position={searchMarker} icon={searchResultIcon}>
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-base mb-1">🔍 {searchResult.display_name.split(',')[0]}</h3>
                <p className="text-gray-600 mb-1">{searchResult.display_name}</p>
                <p className="text-gray-500 text-xs">
                  {searchResult.lat.toFixed(6)}, {searchResult.lon.toFixed(6)}
                </p>
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

      {/* Search Bar */}
      <div 
        className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
        style={{ zIndex: Z_INDEX.SEARCH_BAR }}
      >
        <MapSearchBar
          onLocationSelect={handleLocationSelect}
          onCurrentLocationClick={handleCurrentLocationClick}
        />
      </div>

      <div
        className="absolute top-6 right-6 pointer-events-none grid grid-cols-2 gap-2"
        style={{ zIndex: Z_INDEX.LAYER_BUTTONS }}
      >
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-lg shadow-md transition-all pointer-events-auto hover:shadow-lg border border-gray-200"
          title="Map Layers"
        >
          <Layers className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => setShowAnalyticsPanel(!showAnalyticsPanel)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showAnalyticsPanel
              ? 'bg-gray-900 border-gray-900 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowDistrictsLayer(!showDistrictsLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showDistrictsLayer
              ? 'bg-blue-600 border-blue-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Districts Layer"
        >
          <MapPin className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowAccidentsLayer(!showAccidentsLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showAccidentsLayer
              ? 'bg-red-600 border-red-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Accident Layer"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowTrafficLayer(!showTrafficLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showTrafficLayer
              ? 'bg-blue-600 border-blue-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Traffic Layer"
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowAirQualityLayer(!showAirQualityLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showAirQualityLayer
              ? 'bg-green-600 border-green-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Air Quality Layer"
        >
          <Wind className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowWaterQualityLayer(!showWaterQualityLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showWaterQualityLayer
              ? 'bg-cyan-600 border-cyan-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Water Quality Layer"
        >
          <Droplets className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowInfrastructureLayer(!showInfrastructureLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showInfrastructureLayer
              ? 'bg-indigo-600 border-indigo-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Infrastructure Layer"
        >
          <Building2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowLandUseLayer(!showLandUseLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showLandUseLayer
              ? 'bg-amber-600 border-amber-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Land Use Layer"
        >
          <MapIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowPopulationLayer(!showPopulationLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showPopulationLayer
              ? 'bg-purple-600 border-purple-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Population Layer"
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowPublicTransportLayer(!showPublicTransportLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showPublicTransportLayer
              ? 'bg-sky-600 border-sky-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Public Transport Layer"
        >
          <Bus className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowTerrainLayer(!showTerrainLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showTerrainLayer
              ? 'bg-slate-600 border-slate-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Terrain Layer"
        >
          <Mountain className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowUrbanPlanLayer(!showUrbanPlanLayer)}
          className={`pointer-events-auto p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border ${
            showUrbanPlanLayer
              ? 'bg-indigo-600 border-indigo-700 text-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 text-gray-700'
          }`}
          title="Urban Plan Layer"
        >
          <FileText className="w-4 h-4" />
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

      {showWardsLayer && (
        <div
          className="absolute top-20 left-6"
          style={{ zIndex: Z_INDEX.INFO_PANELS }}
        >
          <button
            onClick={() => {
              setShowWardsLayer(false)
              setSelectedWard(null)
            }}
            className="bg-white/95 backdrop-blur-md hover:bg-white px-4 py-2 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200 flex items-center gap-2"
          >
            <span>←</span>
            <span className="font-medium text-gray-700">Về danh sách quận</span>
          </button>
        </div>
      )}

      {selectedDistrict && !showWardsLayer && (
        <div
          className="absolute bottom-24 right-6 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-200 max-w-sm"
          style={{ zIndex: Z_INDEX.INFO_PANELS }}
        >
          <button
            onClick={() => setSelectedDistrict(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-gray-800 mb-3 pr-6">
            {selectedDistrict.properties.name}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Mã quận</span>
              <span className="font-semibold text-gray-800">
                {selectedDistrict.properties.code}
              </span>
            </div>
            {selectedDistrict.properties.areaKm2 && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-gray-600">Diện tích</span>
                <span className="font-semibold text-gray-800">
                  {selectedDistrict.properties.areaKm2.toFixed(2)} km²
                </span>
              </div>
            )}
            {selectedDistrict.properties.densityPerKm2 && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-gray-600">Mật độ</span>
                <span className="font-semibold text-gray-800">
                  {selectedDistrict.properties.densityPerKm2.toLocaleString()} người/km²
                </span>
              </div>
            )}
            {selectedDistrict.properties.population && (
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Dân số</span>
                <span className="font-semibold text-blue-600">
                  {selectedDistrict.properties.population.toLocaleString()} người
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowWardsLayer(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Xem phường/xã →
          </button>
        </div>
      )}

      {selectedWard && showWardsLayer && (
        <div
          className="absolute bottom-24 right-6 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-purple-200 max-w-sm"
          style={{ zIndex: Z_INDEX.INFO_PANELS }}
        >
          <button
            onClick={() => setSelectedWard(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-purple-800 mb-3 pr-6">
            {selectedWard.properties.name}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Mã phường</span>
              <span className="font-semibold text-gray-800">
                {selectedWard.properties.code}
              </span>
            </div>
            {selectedWard.properties.districtName && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-gray-600">Thuộc quận</span>
                <span className="font-semibold text-purple-600">
                  {selectedWard.properties.districtName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAccident && showAccidentsLayer && (
        <div
          className="absolute bottom-24 right-6 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-red-200 max-w-sm"
          style={{ zIndex: Z_INDEX.INFO_PANELS }}
        >
          <button
            onClick={() => setSelectedAccident(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-red-800 mb-3 pr-6">
            Tai nạn giao thông
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Đường:</span>
              <span className="font-semibold text-gray-800">
                {selectedAccident.roadName}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Mức độ:</span>
              <span className="font-semibold text-red-600">
                {selectedAccident.severity}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Thương vong:</span>
              <span className="font-semibold text-red-600">
                {selectedAccident.casualties} người
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Ngày xảy ra:</span>
              <span className="font-semibold text-gray-800">
                {new Date(selectedAccident.accidentDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedRoad && showTrafficLayer && (
        <div
          className="absolute bottom-24 left-6 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-blue-200 max-w-sm"
          style={{ zIndex: Z_INDEX.INFO_PANELS }}
        >
          <button
            onClick={() => setSelectedRoad(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-blue-800 mb-3 pr-6">
            {selectedRoad.roadName}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                style={{ backgroundColor: selectedRoad.color }}
              >
                {getCongestionLabel(selectedRoad.congestionLevel)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-gray-600">Lưu lượng:</span>
              <span className="font-semibold text-gray-800">
                {selectedRoad.trafficVolume.toLocaleString()} xe/ngày
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Tốc độ TB:</span>
              <span className="font-semibold text-blue-600">
                {selectedRoad.averageSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      )}

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
