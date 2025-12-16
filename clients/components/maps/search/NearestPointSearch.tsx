'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import {
  Search,
  X,
  MapPin,
  Hospital,
  GraduationCap,
  Store,
  Coffee,
  Fuel,
  Loader2,
  Navigation2,
  Ruler,
} from 'lucide-react'
import { geocodingService, routingService } from '@/services'
import type { GeocodingResult } from '@/interfaces/external/geocoding'
import { Z_INDEX } from '@/constants/zIndex'

interface NearestPointSearchProps {
  isOpen: boolean
  onClose: () => void
  mapInstance: L.Map | null
  currentLocation?: [number, number]
}

interface POICategory {
  id: string
  name: string
  icon: React.ReactNode
  query: string
  color: string
}

interface NearestResult {
  result: GeocodingResult
  distance: number
  duration?: number
}

const POI_CATEGORIES: POICategory[] = [
  {
    id: 'hospital',
    name: 'Bệnh viện',
    icon: <Hospital className="w-5 h-5" />,
    query: 'hospital',
    color: 'bg-red-500',
  },
  {
    id: 'school',
    name: 'Trường học',
    icon: <GraduationCap className="w-5 h-5" />,
    query: 'school',
    color: 'bg-blue-500',
  },
  {
    id: 'supermarket',
    name: 'Siêu thị',
    icon: <Store className="w-5 h-5" />,
    query: 'supermarket',
    color: 'bg-green-500',
  },
  {
    id: 'cafe',
    name: 'Quán cà phê',
    icon: <Coffee className="w-5 h-5" />,
    query: 'cafe',
    color: 'bg-amber-500',
  },
  {
    id: 'gas_station',
    name: 'Trạm xăng',
    icon: <Fuel className="w-5 h-5" />,
    query: 'gas station',
    color: 'bg-purple-500',
  },
]

export default function NearestPointSearch({
  isOpen,
  onClose,
  mapInstance,
  currentLocation,
}: NearestPointSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState<POICategory | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<NearestResult[]>([])
  const markersRef = useRef<L.Marker[]>([])
  const [selectedResult, setSelectedResult] = useState<NearestResult | null>(null)
  const [searchRadius, setSearchRadius] = useState(5) // km

  useEffect(() => {
    if (selectedCategory && currentLocation) {
      searchNearestPoints()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, currentLocation, searchRadius])

  const clearMarkers = useCallback(() => {
    if (!mapInstance) return
    markersRef.current.forEach(marker => mapInstance.removeLayer(marker))
    markersRef.current = []
  }, [mapInstance])

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      clearMarkers()
    }
  }, [clearMarkers])

  const searchNearestPoints = async () => {
    if (!selectedCategory || !currentLocation) return

    setIsSearching(true)
    setResults([])
    clearMarkers()

    try {
      const [lat, lon] = currentLocation

      // Calculate search bounds (rough approximation: 1 degree ≈ 111 km)
      const radiusInDegrees = searchRadius / 111
      const viewbox: [number, number, number, number] = [
        lon - radiusInDegrees,
        lat - radiusInDegrees,
        lon + radiusInDegrees,
        lat + radiusInDegrees,
      ]

      // Search for POIs
      const searchResults = await geocodingService.searchInBounds(
        viewbox,
        selectedCategory.query,
        20
      )

      // Calculate distances and sort
      const resultsWithDistance = searchResults
        .map(result => ({
          result,
          distance: routingService.calculateDistance(lat, lon, result.lat, result.lon),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10) // Top 10 nearest

      setResults(resultsWithDistance)
      displayMarkers(resultsWithDistance)
    } catch (error) {
      console.error('Error searching nearest points:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const displayMarkers = (nearestResults: NearestResult[]) => {
    if (!mapInstance) return

    clearMarkers()

    const newMarkers = nearestResults.map((item, index) => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full shadow-lg border-2 border-white font-bold text-sm">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })

      const marker = L.marker([item.result.lat, item.result.lon], { icon: customIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <div class="p-2">
            <div class="font-bold text-sm mb-1">${geocodingService.formatAddress(item.result)}</div>
            <div class="text-xs text-gray-600">
              📍 ${routingService.formatDistance(item.distance)}
            </div>
          </div>
        `)

      marker.on('click', () => {
        setSelectedResult(item)
      })

      return marker
    })

    markersRef.current = newMarkers

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const group = L.featureGroup(newMarkers)
      mapInstance.fitBounds(group.getBounds(), { padding: [50, 50] })
    }
  }



  const handleGetDirections = (result: NearestResult) => {
    // This would trigger the routing panel
    console.log('Get directions to:', result.result.display_name)
    // You can emit an event or use a callback here
  }

  const handleClearSelection = () => {
    setSelectedCategory(null)
    setResults([])
    setSelectedResult(null)
    clearMarkers()
  }

  if (!isOpen) return null

  return (
    <div
      className="absolute top-6 right-6 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ zIndex: Z_INDEX.NEAREST_SEARCH_PANEL }}
    >
      {/* Header */}
      <div className="p-4 bg-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <h3 className="font-bold text-lg">Tìm điểm gần nhất</h3>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Current Location Info */}
        {currentLocation ? (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Vị trí hiện tại:</span>
            </div>
            <div className="text-gray-600 text-xs mt-1">
              {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            Vui lòng bật vị trí hiện tại để sử dụng tính năng này
          </div>
        )}

        {/* Search Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bán kính tìm kiếm: {searchRadius} km
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>20 km</span>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn loại địa điểm
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POI_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                disabled={!currentLocation}
                className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                  selectedCategory?.id === category.id
                    ? 'bg-gray-800 border-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clear Selection */}
        {selectedCategory && (
          <button
            onClick={handleClearSelection}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Xóa lựa chọn
          </button>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Tìm thấy {results.length} kết quả
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedResult === item
                      ? 'border-gray-800 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedResult(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm truncate">
                        {item.result.address?.road || item.result.display_name.split(',')[0]}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {geocodingService.formatAddress(item.result)}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Ruler className="w-3 h-3" />
                          <span>{routingService.formatDistance(item.distance)}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGetDirections(item)
                          }}
                          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium"
                        >
                          <Navigation2 className="w-3 h-3" />
                          <span>Chỉ đường</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isSearching && selectedCategory && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">Không tìm thấy kết quả</p>
            <p className="text-sm mt-1">Thử tăng bán kính tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  )
}
