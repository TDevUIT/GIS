'use client'

import { useState, useRef, useEffect } from 'react'
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
  Upload
} from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'

interface DrawingTool {
  id: string
  icon: React.ReactNode
  label: string
  type: 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'marker' | 'circlemarker' | 'delete' | 'export' | 'import'
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

export default function DrawingToolbar() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const map = useMap()
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null)
  const drawControlRef = useRef<any>(null)
  const currentDrawHandlerRef = useRef<any>(null)

  useEffect(() => {
    if (!map) return

    // Initialize FeatureGroup for drawn items
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    drawnItemsRef.current = drawnItems

    // Add draw control (hidden by default, we'll use custom toolbar)
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    })
    drawControlRef.current = drawControl

    // Listen for created shapes
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer
      drawnItems.addLayer(layer)
      setActiveTool(null)
    })

    return () => {
      map.removeLayer(drawnItems)
      map.off(L.Draw.Event.CREATED)
    }
  }, [map])

  const handleToolClick = (tool: DrawingTool) => {
    if (!map || !drawnItemsRef.current) return

    // Stop current drawing if any
    if (currentDrawHandlerRef.current) {
      currentDrawHandlerRef.current.disable()
      currentDrawHandlerRef.current = null
    }

    // Handle delete tool
    if (tool.type === 'delete') {
      drawnItemsRef.current.clearLayers()
      setActiveTool(null)
      return
    }

    // Handle export tool
    if (tool.type === 'export') {
      const data = drawnItemsRef.current.toGeoJSON()
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

    // Handle import tool
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
                drawnItemsRef.current?.addLayer(layer)
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

    // Toggle active tool
    if (activeTool === tool.id) {
      setActiveTool(null)
      return
    }

    setActiveTool(tool.id)

    // Create new draw handler based on tool type
    let drawHandler: any

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
          shapeOptions: {
            color: '#3b82f6',
            weight: 4,
          },
        })
        break
      case 'polygon':
        drawHandler = new L.Draw.Polygon(map as any, {
          shapeOptions: {
            color: '#10b981',
            fillOpacity: 0.3,
          },
        })
        break
      case 'rectangle':
        drawHandler = new L.Draw.Rectangle(map as any, {
          shapeOptions: {
            color: '#f59e0b',
            fillOpacity: 0.3,
          },
        })
        break
      case 'circle':
        drawHandler = new L.Draw.Circle(map as any, {
          shapeOptions: {
            color: '#ef4444',
            fillOpacity: 0.3,
          },
        })
        break
      case 'circlemarker':
        drawHandler = new L.Draw.CircleMarker(map as any)
        break
    }

    if (drawHandler) {
      drawHandler.enable()
      currentDrawHandlerRef.current = drawHandler
    }
  }

  return (
    <div 
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
      style={{ zIndex: Z_INDEX.DRAWING_TOOLBAR }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-2 pointer-events-auto">
        <div className="flex gap-1">
          {drawingTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`
                relative p-3 rounded-xl transition-all duration-200
                hover:bg-blue-50 hover:shadow-md
                ${activeTool === tool.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-700'
                }
                ${tool.type === 'delete' ? 'text-red-500 hover:bg-red-50' : ''}
                ${tool.type === 'export' || tool.type === 'import' ? 'text-green-600 hover:bg-green-50' : ''}
              `}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>
      
      {activeTool && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
          {drawingTools.find(t => t.id === activeTool)?.label}
        </div>
      )}
    </div>
  )
}
