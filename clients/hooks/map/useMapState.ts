import { useState } from 'react'
import L from 'leaflet'
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
import { FeatureAction } from '@/constants/featureCategories'
import type { GeocodingResult } from '@/interfaces/external/geocoding'

interface QuickActionButton {
  id: string
  name: string
  service: string
}

const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

export function useMapState() {
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
    devLog('Selected feature:', action.name, 'Service:', action.service)
  }

  const handleQuickAction = (button: QuickActionButton) => {
    setActiveQuickAction(button.id)
    devLog('Quick action:', button.name, 'Service:', button.service)
  }

  const handleDistrictClick = (district: DistrictGeoJSON) => {
    setSelectedDistrict(district)
    setShowWardsLayer(true)
    devLog('Selected district:', district.properties.name)
  }

  const handleWardClick = (ward: WardGeoJSON) => {
    setSelectedWard(ward)
    devLog('Selected ward:', ward.properties.name)
  }

  const handleAccidentClick = (accident: AccidentPoint) => {
    setSelectedAccident(accident)
    devLog('Selected accident:', accident.roadName)
  }

  const handleRoadClick = (road: TrafficLine) => {
    setSelectedRoad(road)
    devLog('Selected road:', road.roadName)
  }

  const handleAirQualityClick = (point: AirQualityPoint) => {
    setSelectedAirQuality(point)
    devLog('Selected air quality:', point.districtName, point.level)
  }

  const handleWaterQualityClick = (point: WaterQualityPoint) => {
    setSelectedWaterQuality(point)
    devLog('Selected water quality:', point.sourceName, point.quality)
  }

  const handleInfrastructureClick = (point: InfrastructurePoint) => {
    setSelectedInfrastructure(point)
    devLog('Selected infrastructure:', point.name, point.category)
  }

  const handleLandUseClick = (polygon: LandUsePolygon) => {
    setSelectedLandUse(polygon)
    devLog('Selected land use:', polygon.type, polygon.area)
  }

  const handlePopulationClick = (point: PopulationPoint) => {
    setSelectedPopulation(point)
    devLog('Selected population:', point.districtName, point.density)
  }

  const handlePublicTransportClick = (route: PublicTransportRoute) => {
    setSelectedPublicTransport(route)
    devLog('Selected public transport:', route.routeName, route.mode)
  }

  const handleTerrainClick = (polygon: TerrainPolygon) => {
    setSelectedTerrain(polygon)
    devLog('Selected terrain:', polygon.elevation, polygon.slope)
  }

  const handleUrbanPlanClick = (urbanPlan: UrbanPlanPolygon) => {
    setSelectedUrbanPlan(urbanPlan)
    devLog('Selected urban plan:', urbanPlan.planName)
  }

  const handleLocationFound = (lat: number, lng: number) => {
    setCurrentLocation([lat, lng])
    devLog('Current location:', lat, lng)
  }

  const handleLocationSelect = (result: GeocodingResult) => {
    const coords: [number, number] = [result.lat, result.lon]
    setSearchMarker(coords)
    setSearchResult(result)
    devLog('Selected location:', result.display_name)
  }

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCurrentLocation([lat, lng])
          devLog('Current location found:', lat, lng)
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

  return {
    currentLocation, setCurrentLocation,
    selectedLocation, setSelectedLocation,
    selectedDistrict, setSelectedDistrict,
    selectedWard, setSelectedWard,
    selectedAccident, setSelectedAccident,
    selectedRoad, setSelectedRoad,
    selectedAirQuality, setSelectedAirQuality,
    selectedWaterQuality, setSelectedWaterQuality,
    selectedInfrastructure, setSelectedInfrastructure,
    selectedLandUse, setSelectedLandUse,
    selectedPopulation, setSelectedPopulation,
    selectedPublicTransport, setSelectedPublicTransport,
    selectedTerrain, setSelectedTerrain,
    selectedUrbanPlan, setSelectedUrbanPlan,

    showDistrictsLayer, setShowDistrictsLayer,
    showWardsLayer, setShowWardsLayer,
    showAccidentsLayer, setShowAccidentsLayer,
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
    searchMarker, setSearchMarker,
    searchResult, setSearchResult,
    mapInstance, setMapInstance,
    activeFeature, setActiveFeature,
    activeQuickAction, setActiveQuickAction,

    handleFeatureSelect,
    handleQuickAction,
    handleDistrictClick,
    handleWardClick,
    handleAccidentClick,
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
    handleLocationSelect,
    handleCurrentLocationClick
  }
}
