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
