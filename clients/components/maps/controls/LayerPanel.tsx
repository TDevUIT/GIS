'use client'

import { Layers, X } from 'lucide-react'
import { MapLayer } from '@/types/map'
import { LAYER_OPTIONS } from '@/constants/mapLayers'
import { Z_INDEX } from '@/constants/zIndex'

interface LayerPanelProps {
  isOpen: boolean
  activeLayer: MapLayer
  onClose: () => void
  onLayerChange: (layer: MapLayer) => void
}

export default function LayerPanel({
  isOpen,
  activeLayer,
  onClose,
  onLayerChange,
}: LayerPanelProps) {
  if (!isOpen) return null

  return (
    <div
      className="absolute top-32 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-80 border border-gray-200 transition-all duration-200 ease-out opacity-100"
      style={{ zIndex: Z_INDEX.LAYER_PANEL }}
    >
      <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Map Layers
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-all"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable list for many items */}
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-4 space-y-2">
        {LAYER_OPTIONS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeLayer === layer.id
                ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
            }`}
            aria-label={`Select ${layer.name}`}
          >
            {layer.previewUrl ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-200">
                <img
                  src={layer.previewUrl}
                  alt={layer.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${layer.gradient} flex-shrink-0 shadow-sm`}
              />
            )}
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm text-gray-800">{layer.name}</div>
              <div className="text-xs text-gray-500">{layer.description}</div>
            </div>
            {activeLayer === layer.id && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
