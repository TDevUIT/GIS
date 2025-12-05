'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import L from 'leaflet'
import {
  Navigation,
  X,
  MapPin,
  Flag,
  Car,
  Bike,
  Footprints,
  Loader2,
  ArrowRight,
  Clock,
  Ruler,
  RotateCcw,
} from 'lucide-react'
import { routingService, RoutePoint, RouteResult, TransportMode } from '@/services'
// import { geocodingService } from '@/services'
import { Z_INDEX } from '@/constants/zIndex'

interface RoutingPanelProps {
  isOpen: boolean
  onClose: () => void
  mapInstance: L.Map | null
  startPoint?: RoutePoint
  endPoint?: RoutePoint
}

export default function RoutingPanel({
  isOpen,
  onClose,
  mapInstance,
  startPoint: initialStart,
  endPoint: initialEnd,
}: RoutingPanelProps) {
  const [startPoint, setStartPoint] = useState<RoutePoint | null>(initialStart || null)
  const [endPoint, setEndPoint] = useState<RoutePoint | null>(initialEnd || null)
  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')
  const [transportMode, setTransportMode] = useState<TransportMode>('driving')
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [routeLayer, setRouteLayer] = useState<L.Polyline | null>(null)
  const [markers, setMarkers] = useState<{ start: L.Marker | null; end: L.Marker | null }>({
    start: null,
    end: null,
  })

  // Transport mode options
  const transportModes: { mode: TransportMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'driving', icon: <Car className="w-5 h-5" />, label: 'Ô tô' },
    { mode: 'motorcycle', icon: <Car className="w-5 h-5" />, label: 'Xe máy' },
    { mode: 'cycling', icon: <Bike className="w-5 h-5" />, label: 'Xe đạp' },
    { mode: 'walking', icon: <Footprints className="w-5 h-5" />, label: 'Đi bộ' },
  ]

  // Custom icons
  const startIcon = useMemo(() => L.divIcon({
    className: 'custom-marker-start',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
        <text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="bold">A</text>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }), [])

  const endIcon = useMemo(() => L.divIcon({
    className: 'custom-marker-end',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
        <text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="bold">B</text>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }), [])

  const getRouteColor = useCallback(() => {
    // Đơn giản hóa - dùng 1 màu cho tất cả phương tiện
    return '#1f2937' // gray-800
  }, [])

  const clearRoute = useCallback(() => {
    if (!mapInstance) return

    if (routeLayer) {
      mapInstance.removeLayer(routeLayer)
      setRouteLayer(null)
    }
    if (markers.start) {
      mapInstance.removeLayer(markers.start)
    }
    if (markers.end) {
      mapInstance.removeLayer(markers.end)
    }
    setMarkers({ start: null, end: null })
    setRoute(null)
  }, [mapInstance, routeLayer, markers])

  const displayRoute = useCallback((routeResult: RouteResult) => {
    if (!mapInstance) return

    // Remove old route
    if (routeLayer) {
      mapInstance.removeLayer(routeLayer)
    }

    // Remove old markers
    if (markers.start) mapInstance.removeLayer(markers.start)
    if (markers.end) mapInstance.removeLayer(markers.end)

    // Convert coordinates from [lon, lat] to [lat, lon]
    const latLngs: [number, number][] = routeResult.coordinates.map(coord => [coord[1], coord[0]])

    // Draw route
    const polyline = L.polyline(latLngs, {
      color: getRouteColor(),
      weight: 5,
      opacity: 0.7,
    }).addTo(mapInstance)

    setRouteLayer(polyline)

    // Add markers
    if (startPoint) {
      const startMarker = L.marker([startPoint.lat, startPoint.lon], { icon: startIcon })
        .addTo(mapInstance)
        .bindPopup(`<b>Điểm bắt đầu</b><br>${startPoint.name || 'Điểm A'}`)

      setMarkers(prev => ({ ...prev, start: startMarker }))
    }

    if (endPoint) {
      const endMarker = L.marker([endPoint.lat, endPoint.lon], { icon: endIcon })
        .addTo(mapInstance)
        .bindPopup(`<b>Điểm kết thúc</b><br>${endPoint.name || 'Điểm B'}`)

      setMarkers(prev => ({ ...prev, end: endMarker }))
    }

    // Fit bounds
    mapInstance.fitBounds(polyline.getBounds(), { padding: [50, 50] })
  }, [mapInstance, routeLayer, markers, startPoint, endPoint, startIcon, endIcon, getRouteColor])

  const calculateRoute = useCallback(async () => {
    if (!startPoint || !endPoint) return

    setIsCalculating(true)
    setError(null)

    try {
      const result = await routingService.getRoute(startPoint, endPoint, transportMode)
      setRoute(result)
      displayRoute(result)
    } catch (err) {
      setError('Không thể tính toán lộ trình. Vui lòng thử lại.')
      console.error('Route calculation error:', err)
    } finally {
      setIsCalculating(false)
    }
  }, [startPoint, endPoint, transportMode, displayRoute])

  // Calculate route
  useEffect(() => {
    if (startPoint && endPoint) {
      calculateRoute()
    }
  }, [startPoint, endPoint, transportMode, calculateRoute])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRoute()
    }
  }, [clearRoute])

  const handleReset = () => {
    setStartPoint(null)
    setEndPoint(null)
    setStartQuery('')
    setEndQuery('')
    setRoute(null)
    setError(null)
    clearRoute()
  }

  const handleSwap = () => {
    const temp = startPoint
    setStartPoint(endPoint)
    setEndPoint(temp)

    const tempQuery = startQuery
    setStartQuery(endQuery)
    setEndQuery(tempQuery)
  }

  if (!isOpen) return null

  return (
    <div
      className="absolute top-6 left-6 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ zIndex: Z_INDEX.ROUTING_PANEL }}
    >
      {/* Header */}
      <div className="p-4 bg-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          <h3 className="font-bold text-lg">Chỉ đường</h3>
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
        {/* Transport Mode Selection */}
        <div className="grid grid-cols-4 gap-2">
          {transportModes.map((item) => (
            <button
              key={item.mode}
              onClick={() => setTransportMode(item.mode)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                transportMode === item.mode
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Start Point Input */}
        <div className="relative">
          <div className="absolute left-3 top-3.5 text-green-500">
            <MapPin className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={startQuery}
            onChange={(e) => setStartQuery(e.target.value)}
            placeholder="Điểm bắt đầu..."
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-800 transition-colors"
          />
          {startPoint && (
            <div className="mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              ✓ {startPoint.name || `${startPoint.lat.toFixed(4)}, ${startPoint.lon.toFixed(4)}`}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            disabled={!startPoint || !endPoint}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Đổi điểm"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* End Point Input */}
        <div className="relative">
          <div className="absolute left-3 top-3.5 text-red-500">
            <Flag className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={endQuery}
            onChange={(e) => setEndQuery(e.target.value)}
            placeholder="Điểm kết thúc..."
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-800 transition-colors"
          />
          {endPoint && (
            <div className="mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              ✓ {endPoint.name || `${endPoint.lat.toFixed(4)}, ${endPoint.lon.toFixed(4)}`}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isCalculating && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        )}

        {/* Route Summary */}
        {route && !isCalculating && (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-700" />
                  <div>
                    <div className="text-xs text-gray-600">Khoảng cách</div>
                    <div className="font-bold text-gray-800">
                      {routingService.formatDistance(route.distance)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-700" />
                  <div>
                    <div className="text-xs text-gray-600">Thời gian</div>
                    <div className="font-bold text-gray-800">
                      {routingService.formatDuration(route.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Instructions */}
            {route.instructions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Hướng dẫn chi tiết
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {route.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg border border-gray-200 text-sm"
                    >
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-700">{instruction.text}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {routingService.formatDistance(instruction.distance)}
                            {' • '}
                            {routingService.formatDuration(instruction.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={() => startPoint && endPoint && calculateRoute()}
            disabled={!startPoint || !endPoint || isCalculating}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tính toán lộ trình
          </button>
        </div>
      </div>
    </div>
  )
}
