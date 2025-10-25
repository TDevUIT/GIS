'use client'

import { useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  MapPin,
  Home,
  Building2,
  Store,
  Coffee,
  UtensilsCrossed,
  Hospital,
  GraduationCap,
  Church,
  Landmark,
  TreePine,
  Fuel,
  ParkingCircle,
  Hotel,
  ShoppingCart
} from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'

interface IconItem {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  iconUrl: string
}

const iconItems: IconItem[] = [
  {
    id: 'default',
    icon: <MapPin className="w-5 h-5" />,
    label: 'Điểm đánh dấu',
    color: '#3b82f6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  },
  {
    id: 'home',
    icon: <Home className="w-5 h-5" />,
    label: 'Nhà',
    color: '#10b981',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'building',
    icon: <Building2 className="w-5 h-5" />,
    label: 'Tòa nhà',
    color: '#6366f1',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'store',
    icon: <Store className="w-5 h-5" />,
    label: 'Cửa hàng',
    color: '#f59e0b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  },
  {
    id: 'coffee',
    icon: <Coffee className="w-5 h-5" />,
    label: 'Quán cà phê',
    color: '#92400e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  },
  {
    id: 'restaurant',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    label: 'Nhà hàng',
    color: '#ef4444',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'hospital',
    icon: <Hospital className="w-5 h-5" />,
    label: 'Bệnh viện',
    color: '#dc2626',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'school',
    icon: <GraduationCap className="w-5 h-5" />,
    label: 'Trường học',
    color: '#eab308',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  },
  {
    id: 'church',
    icon: <Church className="w-5 h-5" />,
    label: 'Nhà thờ',
    color: '#8b5cf6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'landmark',
    icon: <Landmark className="w-5 h-5" />,
    label: 'Địa danh',
    color: '#f97316',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  },
  {
    id: 'park',
    icon: <TreePine className="w-5 h-5" />,
    label: 'Công viên',
    color: '#22c55e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'gas',
    icon: <Fuel className="w-5 h-5" />,
    label: 'Trạm xăng',
    color: '#64748b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  },
]

export default function DraggableIcons() {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIcon, setDraggedIcon] = useState<IconItem | null>(null)
  const map = useMap()

  const handleDragStart = (e: React.DragEvent, item: IconItem) => {
    setIsDragging(true)
    setDraggedIcon(item)
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/json', JSON.stringify(item))
    
    // Create drag image
    const dragImage = document.createElement('div')
    dragImage.className = 'bg-white p-2 rounded-lg shadow-lg border-2'
    dragImage.style.borderColor = item.color
    dragImage.innerHTML = `<div class="text-${item.color}">${item.label}</div>`
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedIcon(null)
  }

  // Add map event listeners for drop
  if (map) {
    const mapContainer = map.getContainer()
    
    mapContainer.ondragover = (e) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = 'copy'
    }

    mapContainer.ondrop = (e) => {
      e.preventDefault()
      
      if (!draggedIcon) return

      // Get map coordinates from mouse position
      const latlng = map.mouseEventToLatLng(e as any)

      // Create custom icon
      const customIcon = L.icon({
        iconUrl: draggedIcon.iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      // Add marker at drop location
      const marker = L.marker(latlng, { 
        icon: customIcon,
        draggable: true,
      })

      marker.addTo(map)
      
      // Add popup
      marker.bindPopup(`
        <div class="text-sm">
          <h3 class="font-bold text-base mb-1">${draggedIcon.label}</h3>
          <p class="text-gray-600 mb-2">Vị trí: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</p>
          <button 
            class="text-red-500 hover:text-red-700 text-xs"
            onclick="this.closest('.leaflet-popup').remove(); arguments[0].stopPropagation();"
          >
            Xóa marker
          </button>
        </div>
      `)

      // Enable marker editing
      marker.on('click', () => {
        marker.openPopup()
      })

      setDraggedIcon(null)
    }
  }

  return (
    <div 
      className="absolute right-6 bottom-6 pointer-events-none"
      style={{ zIndex: Z_INDEX.DRAGGABLE_ICONS }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-3 pointer-events-auto max-h-[60vh] overflow-y-auto">
        <div className="text-sm font-semibold text-gray-700 mb-3 px-1">
          Kéo thả để thêm icon
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {iconItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl
                border-2 transition-all duration-200 cursor-grab
                hover:shadow-lg hover:scale-105
                ${isDragging && draggedIcon?.id === item.id 
                  ? 'opacity-50 scale-95' 
                  : 'opacity-100'
                }
              `}
              style={{ 
                borderColor: item.color,
                backgroundColor: `${item.color}10`,
              }}
              title={item.label}
            >
              <div style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="text-xs text-gray-700 text-center leading-tight">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl border-2 border-blue-500 border-dashed pointer-events-none" />
        )}
      </div>
    </div>
  )
}
