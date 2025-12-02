import { useState, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-draw'
import { DrawingTool, IconItem } from '@/constants/mapToolbar'

interface UseMapDrawingProps {
  activeTool: string | null
  selectedIcon: IconItem | null
  setActiveTool: (tool: string | null) => void
  setSelectedIcon: (icon: IconItem | null) => void
}

export function useMapDrawing({
  activeTool,
  selectedIcon,
  setActiveTool,
  setSelectedIcon,
}: UseMapDrawingProps) {
  const map = useMap()
  const drawnItemsRef = useState<L.FeatureGroup | null>(() => {
    if (!map) return null
    const fg = new L.FeatureGroup()
    map.addLayer(fg)
    return fg
  })[0]
  const [currentDrawHandler, setCurrentDrawHandler] = useState<L.Draw.Feature | null>(null)
  const mapClickHandlerRef = useRef<((e: L.LeafletMouseEvent) => void) | null>(null)

  const cleanupMapInteractions = () => {
    if (!map) return

    if (currentDrawHandler) {
      currentDrawHandler.disable()
      setCurrentDrawHandler(null)
    }

    if (mapClickHandlerRef.current) {
      map.off('click', mapClickHandlerRef.current)
      mapClickHandlerRef.current = null
    }

    map.getContainer().style.cursor = ''
  }

  const handleToolClick = (tool: DrawingTool) => {
    if (!map || !drawnItemsRef) return

    setSelectedIcon(null)
    map.getContainer().style.cursor = ''

    if (currentDrawHandler) {
      currentDrawHandler.disable()
      setCurrentDrawHandler(null)
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
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event: ProgressEvent<FileReader>) => {
            try {
              if (!event.target?.result) return
              const geojson = JSON.parse(event.target.result as string)
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

    let drawHandler: L.Draw.Feature | undefined

    switch (tool.type) {
      case 'marker':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        drawHandler = new L.Draw.Polyline(map as any, {
          shapeOptions: { color: '#3b82f6', weight: 4 },
        })
        break
      case 'polygon':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        drawHandler = new L.Draw.Polygon(map as any, {
          shapeOptions: { color: '#10b981', fillOpacity: 0.3 },
        })
        break
      case 'rectangle':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        drawHandler = new L.Draw.Rectangle(map as any, {
          shapeOptions: { color: '#f59e0b', fillOpacity: 0.3 },
        })
        break
      case 'circle':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        drawHandler = new L.Draw.Circle(map as any, {
          shapeOptions: { color: '#ef4444', fillOpacity: 0.3 },
        })
        break
    }

    if (drawHandler) {
      drawHandler.enable()
      setCurrentDrawHandler(drawHandler)
    }
  }

  const handleIconSelect = (item: IconItem) => {
    if (!map) return

    if (selectedIcon?.id === item.id) {
      cleanupMapInteractions()
      setSelectedIcon(null)
      return
    }

    cleanupMapInteractions()
    setActiveTool(null)

    // Select new icon
    setSelectedIcon(item)
    map.getContainer().style.cursor = 'crosshair'
  }

  useEffect(() => {
    if (!map || !selectedIcon) {
      if (mapClickHandlerRef.current) {
        map?.off('click', mapClickHandlerRef.current)
        mapClickHandlerRef.current = null
      }
      return
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!selectedIcon) return

      const customIcon = L.icon({
        iconUrl: selectedIcon.iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker = L.marker(e.latlng, { icon: customIcon, draggable: false })
      marker.addTo(map)
      if (drawnItemsRef) {
        drawnItemsRef.addLayer(marker)
      }
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

    if (mapClickHandlerRef.current) {
      map.off('click', mapClickHandlerRef.current)
    }

    mapClickHandlerRef.current = handleMapClick
    map.on('click', handleMapClick)

    return () => {
      if (mapClickHandlerRef.current) {
        map.off('click', mapClickHandlerRef.current)
        mapClickHandlerRef.current = null
      }
    }
  }, [map, selectedIcon, drawnItemsRef])

  useEffect(() => {
    if (map && drawnItemsRef) {
      map.off(L.Draw.Event.CREATED)
      map.on(L.Draw.Event.CREATED, (e: L.LeafletEvent) => {
        const event = e as L.DrawEvents.Created
        const layer = event.layer

        if ((layer as any).editing) {
          (layer as any).editing.disable()
        }

        if (layer.options) {
          (layer.options as any).draggable = false
        }

        drawnItemsRef.addLayer(layer)

        if (currentDrawHandler) {
          currentDrawHandler.disable()
          setCurrentDrawHandler(null)
        }
        setActiveTool(null)
      })
    }
  }, [map, drawnItemsRef, currentDrawHandler, setActiveTool])

  return {
    handleToolClick,
    handleIconSelect,
    cleanupMapInteractions,
    handleTabChange: (tab: string, setStoreActiveTab: (tab: string) => void) => {
      cleanupMapInteractions()
      setActiveTool(null)
      setSelectedIcon(null)
      setStoreActiveTab(tab)
    }
  }
}
