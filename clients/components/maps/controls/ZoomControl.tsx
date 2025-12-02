'use client'

import { useMap } from 'react-leaflet'
import { ZoomIn, ZoomOut, Home, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ZoomControlProps {
  onLocationFound?: (lat: number, lng: number) => void
}

export default function ZoomControl({ onLocationFound }: ZoomControlProps) {
  const map = useMap()
  const [isLocating, setIsLocating] = useState(false)

  const handleGoToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị')
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Fly to user's current location with smooth animation
        map.flyTo([latitude, longitude], 15, {
          duration: 1.5,
          easeLinearity: 0.5
        })

        // Notify parent component about location
        if (onLocationFound) {
          onLocationFound(latitude, longitude)
        }

        setIsLocating(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'Không thể lấy vị trí'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối quyền truy cập vị trí'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí'
            break
          case error.TIMEOUT:
            errorMessage = 'Hết thời gian chờ'
            break
        }
        
        alert(errorMessage)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="absolute left-6 bottom-32 z-[1000] flex flex-col">
      <div className="bg-white rounded-2xl border-2 border-white/50">
        <button
          onClick={() => map.zoomIn()}
          className="w-12 h-12 flex items-center justify-center hover:bg-blue-50 hover:rounded-t-2xl transition-all duration-200 ease-in-out group"
          title="Phóng to"
        >
          <ZoomIn className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-12 h-12 flex items-center justify-center hover:bg-blue-50 transition-all duration-200 ease-in-out group"
          title="Thu nhỏ"
        >
          <ZoomOut className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
        </button>
        <button
          onClick={handleGoToCurrentLocation}
          disabled={isLocating}
          className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out rounded-b-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          title="Về vị trí hiện tại"
        >
          {isLocating ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Home className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
