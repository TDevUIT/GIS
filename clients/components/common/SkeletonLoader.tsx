'use client'

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'circle' | 'button'
  count?: number
  className?: string
}

export default function SkeletonLoader({ 
  variant = 'text', 
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  
  const baseClass = 'animate-pulse bg-gray-200 rounded'
  
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className={`${baseClass} h-32 mb-3`} />
            <div className={`${baseClass} h-4 w-3/4 mb-2`} />
            <div className={`${baseClass} h-3 w-1/2`} />
          </div>
        )
      
      case 'list':
        return (
          <div className={`flex items-center gap-3 p-3 ${className}`}>
            <div className={`${baseClass} w-10 h-10 rounded-full flex-shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`${baseClass} h-4 w-3/4`} />
              <div className={`${baseClass} h-3 w-1/2`} />
            </div>
          </div>
        )
      
      case 'circle':
        return (
          <div className={`${baseClass} ${className}`} style={{ borderRadius: '50%' }} />
        )
      
      case 'button':
        return (
          <div className={`${baseClass} h-9 w-24 ${className}`} />
        )
      
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-5/6`} />
            <div className={`${baseClass} h-4 w-4/6`} />
          </div>
        )
    }
  }
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}

// Feature-specific skeleton
export function FeatureCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-2">
          <div className="animate-pulse bg-gray-200 rounded w-8 h-8 mx-auto mb-2" />
          <div className="animate-pulse bg-gray-200 rounded h-3 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  )
}

// Panel skeleton
export function PanelSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-200 rounded w-8 h-8" />
          <div className="flex-1 space-y-2">
            <div className="animate-pulse bg-gray-200 rounded h-4 w-1/3" />
            <div className="animate-pulse bg-gray-200 rounded h-3 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}
