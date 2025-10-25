'use client'

import { useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import {
  Pencil,
  Square,
  Circle,
  MapPin,
  Trash2,
  Triangle,
  Minus,
  Download,
  Upload,
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
  Users,
  User,
  Briefcase,
  X,
  Palette,
  Layers2
} from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'

interface DrawingTool {
  id: string
  icon: React.ReactNode
  label: string
  type: 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'marker' | 'delete' | 'export' | 'import'
}

interface IconItem {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  iconUrl: string
}

interface CategoryItem {
  id: string
  icon: React.ReactNode
  label: string
}

const drawingTools: DrawingTool[] = [
  {
    id: 'marker',
    icon: <MapPin className="w-5 h-5" />,
    label: 'Thêm điểm',
    type: 'marker',
  },
  {
    id: 'polyline',
    icon: <Minus className="w-5 h-5" />,
    label: 'Vẽ đường',
    type: 'polyline',
  },
  {
    id: 'polygon',
    icon: <Triangle className="w-5 h-5" />,
    label: 'Vẽ đa giác',
    type: 'polygon',
  },
  {
    id: 'rectangle',
    icon: <Square className="w-5 h-5" />,
    label: 'Vẽ hình chữ nhật',
    type: 'rectangle',
  },
  {
    id: 'circle',
    icon: <Circle className="w-5 h-5" />,
    label: 'Vẽ hình tròn',
    type: 'circle',
  },
  {
    id: 'delete',
    icon: <Trash2 className="w-5 h-5" />,
    label: 'Xóa hình vẽ',
    type: 'delete',
  },
  {
    id: 'export',
    icon: <Download className="w-5 h-5" />,
    label: 'Xuất dữ liệu',
    type: 'export',
  },
  {
    id: 'import',
    icon: <Upload className="w-5 h-5" />,
    label: 'Nhập dữ liệu',
    type: 'import',
  },
]

const iconItems: IconItem[] = [
  {
    id: 'default',
    icon: <MapPin className="w-4 h-4" />,
    label: 'Điểm',
    color: '#3b82f6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  },
  {
    id: 'home',
    icon: <Home className="w-4 h-4" />,
    label: 'Nhà',
    color: '#10b981',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'building',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Tòa nhà',
    color: '#6366f1',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'store',
    icon: <Store className="w-4 h-4" />,
    label: 'Cửa hàng',
    color: '#f59e0b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  },
  {
    id: 'coffee',
    icon: <Coffee className="w-4 h-4" />,
    label: 'Cà phê',
    color: '#92400e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  },
  {
    id: 'restaurant',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    label: 'Nhà hàng',
    color: '#ef4444',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'hospital',
    icon: <Hospital className="w-4 h-4" />,
    label: 'Bệnh viện',
    color: '#dc2626',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'school',
    icon: <GraduationCap className="w-4 h-4" />,
    label: 'Trường',
    color: '#eab308',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  },
  {
    id: 'church',
    icon: <Church className="w-4 h-4" />,
    label: 'Nhà thờ',
    color: '#8b5cf6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'landmark',
    icon: <Landmark className="w-4 h-4" />,
    label: 'Địa danh',
    color: '#f97316',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  },
  {
    id: 'park',
    icon: <TreePine className="w-4 h-4" />,
    label: 'Công viên',
    color: '#22c55e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'gas',
    icon: <Fuel className="w-4 h-4" />,
    label: 'Xăng',
    color: '#64748b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  },
]

const categoryItems: CategoryItem[] = [
  {
    id: 'community',
    icon: <Users className="w-4 h-4" />,
    label: 'Cộng đồng',
  },
  {
    id: 'religious',
    icon: <Church className="w-4 h-4" />,
    label: 'Tôn giáo',
  },
  {
    id: 'personal',
    icon: <User className="w-4 h-4" />,
    label: 'Cá nhân',
  },
  {
    id: 'buildings',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Tòa nhà',
  },
  {
    id: 'business',
    icon: <Briefcase className="w-4 h-4" />,
    label: 'Doanh nghiệp',
  },
]

type TabType = 'draw' | 'icons' | 'categories'

export default function UnifiedBottomToolbar() {
  const [activeTab, setActiveTab] = useState<TabType>('draw')
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const map = useMap()
  const drawnItemsRef = useState<L.FeatureGroup | null>(() => {
    if (!map) return null
    const fg = new L.FeatureGroup()
    map.addLayer(fg)
    return fg
  })[0]
  const currentDrawHandlerRef = useState<any>(null)[0]

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)

    if (tab !== 'icons') {
      setSelectedIcon(null)
      if (map) {
        map.getContainer().style.cursor = ''
      }
    }
    if (tab !== 'draw') {
      setActiveTool(null)
      if (currentDrawHandlerRef) {
        currentDrawHandlerRef.disable()
      }
    }
  }

  const handleToolClick = (tool: DrawingTool) => {
    if (!map || !drawnItemsRef) return

    // Clear icon selection when using drawing tools
    setSelectedIcon(null)
    if (map) {
      map.getContainer().style.cursor = ''
    }

    if (currentDrawHandlerRef) {
      currentDrawHandlerRef.disable()
    }

    if (tool.type === 'delete') {
      drawnItemsRef.clearLayers()
      setActiveTool(null)
      return
    }

    if (tool.type === 'export') {
      const data = drawnItemsRef.toGeoJSON()
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'map-drawings.geojson'
      link.click()
      URL.revokeObjectURL(url)
      setActiveTool(null)
      return
    }

    if (tool.type === 'import') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.geojson,.json'
      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event: any) => {
            try {
              const geojson = JSON.parse(event.target.result)
              L.geoJSON(geojson).eachLayer((layer) => {
                drawnItemsRef?.addLayer(layer)
              })
            } catch (error) {
              console.error('Error importing GeoJSON:', error)
              alert('Lỗi khi nhập dữ liệu. Vui lòng kiểm tra định dạng file.')
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
      setActiveTool(null)
      return
    }

    if (activeTool === tool.id) {
      setActiveTool(null)
      return
    }

    setActiveTool(tool.id)

    let drawHandler: any
    const drawOptions: any = { map: map as any }

    switch (tool.type) {
      case 'marker':
        drawHandler = new L.Draw.Marker(map as any, {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        })
        break
      case 'polyline':
        drawHandler = new L.Draw.Polyline(map as any, {
          shapeOptions: { color: '#3b82f6', weight: 4 },
        })
        break
      case 'polygon':
        drawHandler = new L.Draw.Polygon(map as any, {
          shapeOptions: { color: '#10b981', fillOpacity: 0.3 },
        })
        break
      case 'rectangle':
        drawHandler = new L.Draw.Rectangle(map as any, {
          shapeOptions: { color: '#f59e0b', fillOpacity: 0.3 },
        })
        break
      case 'circle':
        drawHandler = new L.Draw.Circle(map as any, {
          shapeOptions: { color: '#ef4444', fillOpacity: 0.3 },
        })
        break
    }

    if (drawHandler) {
      drawHandler.enable()
    }
  }

  const handleIconSelect = (item: IconItem) => {
    if (!map) return

    if (currentDrawHandlerRef) {
      currentDrawHandlerRef.disable()
    }
    setActiveTool(null)

    if (selectedIcon?.id === item.id) {
      setSelectedIcon(null)
      map.getContainer().style.cursor = ''
      return
    }

    setSelectedIcon(item)
    map.getContainer().style.cursor = 'crosshair'
  }

  if (map && selectedIcon) {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const customIcon = L.icon({
        iconUrl: selectedIcon.iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker = L.marker(e.latlng, { icon: customIcon, draggable: true })
      marker.addTo(map)
      marker.bindPopup(`
        <div class="text-sm">
          <h3 class="font-bold text-base mb-1">${selectedIcon.label}</h3>
          <p class="text-gray-600 mb-2">Vị trí: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}</p>
          <button
            class="text-red-500 hover:text-red-700 text-xs font-medium"
            onclick="this.closest('.leaflet-popup').remove()"
          >
            Xóa marker
          </button>
        </div>
      `)
      marker.on('click', () => marker.openPopup())
    }

    map.off('click', handleMapClick)
    map.on('click', handleMapClick)
  }

  if (map && drawnItemsRef) {
    map.off(L.Draw.Event.CREATED)
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer
      drawnItemsRef.addLayer(layer)
      setActiveTool(null)
    })
  }

  if (!isExpanded) {
    return (
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{ zIndex: Z_INDEX.DRAWING_TOOLBAR }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 pointer-events-auto hover:scale-105 flex items-center gap-2"
        >
          <Palette className="w-5 h-5" />
          <span className="font-medium">Mở công cụ</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
      style={{ zIndex: Z_INDEX.DRAWING_TOOLBAR }}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 pointer-events-auto overflow-hidden max-w-3xl">
        <div className="flex items-center justify-between border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5">
          <div className="flex gap-1.5">
            <button
              onClick={() => handleTabChange('draw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'draw'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              Vẽ
            </button>
            <button
              onClick={() => handleTabChange('icons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'icons'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Icon
            </button>
            <button
              onClick={() => handleTabChange('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layers2 className="w-3.5 h-3.5" />
              Danh mục
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Thu gọn"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <div className="p-3">
          {activeTab === 'draw' && (
            <div className="flex gap-2 flex-wrap justify-center">
              {drawingTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className={`
                    relative p-3 rounded-xl transition-all duration-200 group
                    hover:shadow-lg
                    ${activeTool === tool.id
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
                    }
                    ${tool.type === 'delete' ? 'hover:bg-red-50 hover:text-red-500' : ''}
                    ${tool.type === 'export' || tool.type === 'import' ? 'hover:bg-green-50 hover:text-green-600' : ''}
                  `}
                  title={tool.label}
                >
                  {tool.icon}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {tool.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'icons' && (
            <div>
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-2 overflow-hidden ">
                {iconItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleIconSelect(item)}
                    className={`
                      flex flex-col items-center gap-1 p-2 rounded-xl
                      border-2 transition-all duration-200 cursor-pointer
                      hover:shadow-lg
                      ${selectedIcon?.id === item.id
                        ? 'border-2 border-black'
                        : ''
                      }
                    `}
                    style={{
                      borderColor: item.color,
                      backgroundColor: selectedIcon?.id === item.id
                        ? `${item.color}30`
                        : `${item.color}15`,
                    }}
                    title={item.label}
                  >
                    <div style={{ color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="text-[10px] text-gray-700 text-center leading-tight">
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveCategory(item.id)}
                    className={`
                      px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5
                      ${activeCategory === item.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                      }
                    `}
                  >
                    <div className="w-4 h-4">{item.icon}</div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
