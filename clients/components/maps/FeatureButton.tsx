'use client'

import { FeatureAction } from '@/constants/featureCategories'

interface FeatureButtonProps {
  action: FeatureAction
  onClick: (action: FeatureAction) => void
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function FeatureButton({ 
  action, 
  onClick, 
  isActive = false,
  size = 'md' 
}: FeatureButtonProps) {
  const Icon = action.icon
  
  const sizeClasses = {
    sm: 'p-1.5 text-[10px]',
    md: 'p-2 text-[11px]',
    lg: 'p-2.5 text-xs',
  }

  return (
    <button
      onClick={() => onClick(action)}
      className={`
        relative flex flex-col items-center justify-center rounded-md transition-all
        border ${sizeClasses[size]} min-h-[60px]
        ${isActive
          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
      title={action.description}
    >
      {/* Badge */}
      {action.badge && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded-full font-semibold leading-none">
          {action.badge}
        </span>
      )}

      {/* Icon */}
      <Icon className={`w-3.5 h-3.5 mb-0.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
      
      {/* Label */}
      <span className="font-medium text-center leading-tight line-clamp-2">
        {action.name}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white rounded-full" />
      )}
    </button>
  )
}
