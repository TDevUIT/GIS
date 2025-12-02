'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Navigation, Loader2, Target } from 'lucide-react'
import { geocodingService, GeocodingResult } from '@/services'
import { Z_INDEX } from '@/constants/zIndex'

interface MapSearchBarProps {
  onLocationSelect: (result: GeocodingResult) => void
  onCurrentLocationClick?: () => void
  placeholder?: string
}

export default function MapSearchBar({
  onLocationSelect,
  onCurrentLocationClick,
  placeholder = 'TÃ¬m kiáº¿m Ä‘á»‹a Ä‘iá»ƒm, Ä‘á»‹a chá»‰...',
}: MapSearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const searchResults = await geocodingService.search(query, 8, 'vn')
        setResults(searchResults)
        setShowResults(true)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = (result: GeocodingResult) => {
    setQuery(geocodingService.formatAddress(result))
    setShowResults(false)
    onLocationSelect(result)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        break
    }
  }

  const getResultIcon = (type?: string) => {
    if (!type) return <MapPin className="w-3.5 h-3.5 text-gray-600" />
    
    if (type.includes('school') || type.includes('university')) {
      return <span className="text-base">ðŸ«</span>
    }
    if (type.includes('hospital') || type.includes('clinic')) {
      return <span className="text-base">ðŸ¥</span>
    }
    if (type.includes('restaurant') || type.includes('cafe')) {
      return <span className="text-base">ðŸ½ï¸</span>
    }
    if (type.includes('hotel') || type.includes('accommodation')) {
      return <span className="text-base">ðŸ¨</span>
    }
    if (type.includes('park') || type.includes('garden')) {
      return <span className="text-base">ðŸŒ³</span>
    }
    if (type.includes('shop') || type.includes('mall')) {
      return <span className="text-base">ðŸ›ï¸</span>
    }
    
    return <MapPin className="w-3.5 h-3.5 text-gray-600" />
  }

  return (
    <div
      ref={searchBarRef}
      className="relative w-full max-w-2xl"
      style={{ zIndex: Z_INDEX.SEARCH_BAR }}
    >
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all text-sm text-gray-700 placeholder-gray-400"
          />

          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        {onCurrentLocationClick && (
          <button
            onClick={onCurrentLocationClick}
            className="p-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all group"
            title="Vá»‹ trÃ­ hiá»‡n táº¡i"
          >
            <Target className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-[1250]">
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.place_id}-${index}`}
                onClick={() => handleSelectResult(result)}
                className={`w-full px-3 py-2 flex items-start gap-2.5 hover:bg-gray-50 transition-colors text-left ${
                  selectedIndex === index ? 'bg-gray-50' : ''
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800 truncate">
                    {result.address?.road || result.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {result.display_name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {result.lat.toFixed(5)}, {result.lon.toFixed(5)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Navigation className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && !isSearching && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-[1250]">
          <div className="px-4 py-6 text-center text-gray-500">
            <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="font-medium text-sm">KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£</p>
            <p className="text-xs mt-1">Thá»­ tÃ¬m kiáº¿m vá»›i tá»« khÃ³a khÃ¡c</p>
          </div>
        </div>
      )}
    </div>
  )
}
