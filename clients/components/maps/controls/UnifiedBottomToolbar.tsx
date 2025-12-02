'use client'

import {
  Pencil,
  MapPin,
  X,
  Palette,
  Layers2
} from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'
import { useToolbarStore } from '@/stores/toolbarControlStore'
import { drawingTools, iconItems, categoryItems } from '@/constants/mapToolbar'
import { useMapDrawing } from '@/hooks/map/useMapDrawing'

type TabType = 'draw' | 'icons' | 'categories'

export default function UnifiedBottomToolbar() {
  const {
    activeTab,
    activeTool,
    selectedIcon,
    activeCategory,
    isExpanded,
    setActiveTab: setStoreActiveTab,
    setActiveTool,
    setSelectedIcon,
    setActiveCategory,
    setIsExpanded,
  } = useToolbarStore()

  const {
    handleToolClick,
    handleIconSelect,
    handleTabChange
  } = useMapDrawing({
    activeTool,
    selectedIcon,
    setActiveTool,
    setSelectedIcon
  })

  const onTabChange = (tab: TabType) => {
    handleTabChange(tab, setStoreActiveTab)
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
        <div className="flex items-center justify-between border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
            <button
              onClick={() => onTabChange('draw')}
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
              onClick={() => onTabChange('icons')}
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
              onClick={() => onTabChange('categories')}
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

            {/* Status indicator */}
            {(activeTool || selectedIcon) && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700 font-medium">
                  {activeTool ? `Đang vẽ: ${drawingTools.find(t => t.id === activeTool)?.label}` : `Chọn vị trí cho: ${selectedIcon?.label}`}
                </span>
              </div>
            )}
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
                      ? 'bg-blue-500 text-white shadow-md scale-105 ring-2 ring-blue-300'
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
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-hidden pr-2  ">
                {iconItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleIconSelect(item)}
                    className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl
                    border-2 transition-all duration-200 cursor-pointer
                    mt-1
                    ${selectedIcon?.id === item.id
                      ? 'border-2 border-black'
                      : ''
                    }
                  `}
                  style={{
                    borderColor: selectedIcon?.id === item.id ? '#000' : item.color,
                    backgroundColor: selectedIcon?.id === item.id
                      ? `${item.color}40`
                      : `${item.color}15`,
                    boxShadow: selectedIcon?.id === item.id ? `0 0 0 3px ${item.color}40` : 'none',
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105'
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
