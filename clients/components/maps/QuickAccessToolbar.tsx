'use client'

import { Car, Wind, Droplet, AlertTriangle, Building2, Bus, BarChart3 } from 'lucide-react'
import { Z_INDEX } from '@/constants/zIndex'

interface QuickAccessButton {
  id: string
  name: string
  icon: typeof Car
  service: string
}

const QUICK_ACCESS_BUTTONS: QuickAccessButton[] = [
  {
    id: 'quick-traffic',
    name: 'Traffic',
    icon: Car,
    service: 'getAllTraffics',
  },
  {
    id: 'quick-air',
    name: 'Air Quality',
    icon: Wind,
    service: 'getAllAirQualities',
  },
  {
    id: 'quick-water',
    name: 'Water',
    icon: Droplet,
    service: 'getAllWaterQualities',
  },
  {
    id: 'quick-accidents',
    name: 'Accidents',
    icon: AlertTriangle,
    service: 'getAllAccidents',
  },
  {
    id: 'quick-infra',
    name: 'Infrastructure',
    icon: Building2,
    service: 'getAllInfrastructures',
  },
  {
    id: 'quick-transport',
    name: 'Transport',
    icon: Bus,
    service: 'getAllPublicTransports',
  },
  {
    id: 'quick-analytics',
    name: 'Analytics',
    icon: BarChart3,
    service: 'getGlobalSummary',
  },
]

interface QuickAccessToolbarProps {
  onQuickAction?: (button: QuickAccessButton) => void
  activeButtonId?: string
}

export default function QuickAccessToolbar({ 
  onQuickAction, 
  activeButtonId 
}: QuickAccessToolbarProps) {
  const handleClick = (button: QuickAccessButton) => {
    onQuickAction?.(button)
    console.log('Quick action:', button.name, '→', button.service)
  }

  return (
    <div 
      className="absolute top-6 left-1/2 transform -translate-x-1/2" 
      style={{ zIndex: Z_INDEX.QUICK_ACCESS_TOOLBAR }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 px-2 py-1.5">
        <div className="flex items-center gap-1">
          {QUICK_ACCESS_BUTTONS.map((button) => {
            const Icon = button.icon
            const isActive = activeButtonId === button.id

            return (
              <button
                key={button.id}
                onClick={() => handleClick(button)}
                className={`
                  relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all
                  ${isActive 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={button.name}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium whitespace-nowrap">
                  {button.name}
                </span>
                
                {/* Simple active indicator */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
