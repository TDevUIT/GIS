'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle2, Info } from 'lucide-react'
import { FeatureAction } from '@/constants/featureCategories'
import { Z_INDEX } from '@/constants/zIndex'
import { cn } from '@/lib/utils'

interface FeatureNotificationProps {
  feature: FeatureAction | null
  onClose: () => void
  duration?: number
}

export default function FeatureNotification({ 
  feature, 
  onClose,
  duration = 5000 
}: FeatureNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (feature) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [feature, duration, onClose])

  if (!feature) return null

  const Icon = feature.icon

  return (
    <div 
      className={cn(
        'fixed top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}
      style={{ zIndex: Z_INDEX.NOTIFICATION }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[300px] max-w-[360px]">
        <div className="flex items-start gap-2.5">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-700" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {feature.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {feature.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-medium">Activated</span>
              </div>
              {feature.badge && (
                <span className="ml-auto text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded font-medium">
                  {feature.badge}
                </span>
              )}
            </div>

            {/* Service info */}
            <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
              <Info className="w-3 h-3" />
              <span className="font-mono">{feature.service}()</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
