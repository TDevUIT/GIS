'use client'

import { useState } from 'react'
import { X, Menu, Search } from 'lucide-react'
import { FEATURE_CATEGORIES, FeatureAction } from '@/constants/featureCategories'
import { Z_INDEX } from '@/constants/zIndex'
import FeaturePanel from './FeaturePanel'
import { cn } from '@/lib/utils'

interface FeatureToolbarProps {
  onFeatureSelect?: (action: FeatureAction) => void
}

export default function FeatureToolbar({ onFeatureSelect }: FeatureToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeActionId, setActiveActionId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleActionClick = (action: FeatureAction) => {
    setActiveActionId(action.id)
    onFeatureSelect?.(action)
    
    // Show notification (demo purpose)
    console.log('Feature selected:', action.name, '→', action.service)
  }

  const filteredCategories = FEATURE_CATEGORIES.filter(category => {
    if (!searchQuery) return true
    
    const matchesCategory = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesAction = category.actions.some(action =>
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return matchesCategory || matchesAction
  })

  return (
    <>
      {/* Toggle Button */}
      <div className="absolute bottom-6 right-6" style={{ zIndex: Z_INDEX.FEATURE_BUTTON }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md transition-all bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-lg"
          title={isOpen ? 'Close Features' : 'Open Features'}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <Menu className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Features</span>
            </>
          )}
        </button>
      </div>

      {/* Sidebar Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            style={{ zIndex: Z_INDEX.BACKDROP }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div 
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] lg:w-[560px] bg-white shadow-2xl overflow-hidden flex flex-col"
            style={{ zIndex: Z_INDEX.FEATURE_SIDEBAR }}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Map Features</h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Select a feature to visualize data
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <FeaturePanel
                    key={category.id}
                    category={category}
                    onActionClick={handleActionClick}
                    activeActionId={activeActionId}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">No features found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {FEATURE_CATEGORIES.length} categories • {FEATURE_CATEGORIES.reduce((acc, cat) => acc + cat.actions.length, 0)} features
                </span>
                {activeActionId && (
                  <button
                    onClick={() => setActiveActionId(undefined)}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
