import { Z_INDEX } from '@/constants/zIndex'
import { DistrictGeoJSON, WardGeoJSON, TrafficLine } from '@/types'
import { getCongestionLabel } from '@/utils/trafficHelpers'

interface MapInfoPanelsProps {
  showWardsLayer: boolean
  setShowWardsLayer: (show: boolean) => void
  selectedDistrict: DistrictGeoJSON | null
  setSelectedDistrict: (district: DistrictGeoJSON | null) => void
  selectedWard: WardGeoJSON | null
  setSelectedWard: (ward: WardGeoJSON | null) => void
  // selectedAccident: AccidentPoint | null
  // setSelectedAccident: (accident: AccidentPoint | null) => void
  selectedRoad: TrafficLine | null
  setSelectedRoad: (road: TrafficLine | null) => void
  showTrafficLayer: boolean
}

export default function MapInfoPanels({
  showWardsLayer,
  setShowWardsLayer,
  selectedDistrict,
  setSelectedDistrict,
  selectedWard,
  setSelectedWard,
  // selectedAccident,
  // setSelectedAccident,
  selectedRoad,
  setSelectedRoad,
  showTrafficLayer,
}: MapInfoPanelsProps) {
  return (
    <>
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
    </>
  )
}
