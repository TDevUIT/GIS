import {
  Layers,
  Activity,
  Wind,
  Droplets,
  Building2,
  Map as MapIcon,
  Users,
  Bus,
  Mountain,
  FileText,
  MapPin,
  BarChart3
} from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'

interface LayerControlGroupProps {
  showLayerPanel: boolean
  setShowLayerPanel: (show: boolean) => void
  showAnalyticsPanel: boolean
  setShowAnalyticsPanel: (show: boolean) => void
  showDistrictsLayer: boolean
  setShowDistrictsLayer: (show: boolean) => void
  showTrafficLayer: boolean
  setShowTrafficLayer: (show: boolean) => void
  showAirQualityLayer: boolean
  setShowAirQualityLayer: (show: boolean) => void
  showWaterQualityLayer: boolean
  setShowWaterQualityLayer: (show: boolean) => void
  showInfrastructureLayer: boolean
  setShowInfrastructureLayer: (show: boolean) => void
  showLandUseLayer: boolean
  setShowLandUseLayer: (show: boolean) => void
  showPopulationLayer: boolean
  setShowPopulationLayer: (show: boolean) => void
  showPublicTransportLayer: boolean
  setShowPublicTransportLayer: (show: boolean) => void
  showTerrainLayer: boolean
  setShowTerrainLayer: (show: boolean) => void
  showUrbanPlanLayer: boolean
  setShowUrbanPlanLayer: (show: boolean) => void
}

export default function LayerControlGroup({
  showLayerPanel,
  setShowLayerPanel,
  showAnalyticsPanel,
  setShowAnalyticsPanel,
  showDistrictsLayer,
  setShowDistrictsLayer,
  showTrafficLayer,
  setShowTrafficLayer,
  showAirQualityLayer,
  setShowAirQualityLayer,
  showWaterQualityLayer,
  setShowWaterQualityLayer,
  showInfrastructureLayer,
  setShowInfrastructureLayer,
  showLandUseLayer,
  setShowLandUseLayer,
  showPopulationLayer,
  setShowPopulationLayer,
  showPublicTransportLayer,
  setShowPublicTransportLayer,
  showTerrainLayer,
  setShowTerrainLayer,
  showUrbanPlanLayer,
  setShowUrbanPlanLayer,
}: LayerControlGroupProps) {
  return (
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
  )
}
