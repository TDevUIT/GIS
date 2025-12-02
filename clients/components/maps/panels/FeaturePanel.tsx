'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { FeatureCategory, FeatureAction } from '@/constants/featureCategories'
import FeatureButton from './FeatureButton'
import { cn } from '@/lib/utils'

interface FeaturePanelProps {
  category: FeatureCategory
  onActionClick: (action: FeatureAction) => void
  activeActionId?: string
}

export default function FeaturePanel({ 
  category, 
  onActionClick,
  activeActionId 
}: FeaturePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const CategoryIcon = category.icon

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 transition-all bg-white hover:bg-gray-50 border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-gray-100 p-1.5 rounded-md">
            <CategoryIcon className="w-4 h-4 text-gray-700" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-500">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {category.actions.length}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </button>

      {/* Actions Grid */}
      {isExpanded && (
        <div className="p-3 bg-gray-50">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {category.actions.map((action) => (
              <FeatureButton
                key={action.id}
                action={action}
                onClick={onActionClick}
                isActive={activeActionId === action.id}
                size="md"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
