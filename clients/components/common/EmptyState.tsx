'use client'

import { LucideIcon, SearchX, Inbox, FileX, Frown } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'search' | 'error' | 'minimal'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default'
}: EmptyStateProps) {
  
  // Default icons based on variant
  const DefaultIcon = variant === 'search' ? SearchX 
    : variant === 'error' ? Frown 
    : Inbox
  
  const FinalIcon = Icon || DefaultIcon
  
  if (variant === 'minimal') {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-3 text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            {action.label}
          </button>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center min-h-[300px] p-8">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FinalIcon className="w-8 h-8 text-gray-400" />
        </div>
        
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 mb-4">
            {description}
          </p>
        )}
        
        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
