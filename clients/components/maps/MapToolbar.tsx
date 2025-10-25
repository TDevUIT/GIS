'use client'

import { Users, Church, User, Building2, Briefcase } from 'lucide-react'
import { useState } from 'react'

interface ToolbarItem {
  id: string
  icon: React.ReactNode
  label: string
}

const toolbarItems: ToolbarItem[] = [
  {
    id: 'community',
    icon: <Users className="w-6 h-6" />,
    label: 'Cộng đồng',
  },
  {
    id: 'religious',
    icon: <Church className="w-6 h-6" />,
    label: 'Tôn giáo',
  },
  {
    id: 'personal',
    icon: <User className="w-6 h-6" />,
    label: 'Cá nhân',
  },
  {
    id: 'buildings',
    icon: <Building2 className="w-6 h-6" />,
    label: 'Tòa nhà',
  },
  {
    id: 'business',
    icon: <Briefcase className="w-6 h-6" />,
    label: 'Doanh nghiệp',
  },
]

export default function MapToolbar() {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <div className="absolute left-6 top-36 z-[1000] flex flex-col">
      <div className="bg-gradient-to-b from-sky-400 to-sky-500 rounded-2xl border-2 border-white/50">
        {toolbarItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`
              relative w-12 h-12 flex items-center justify-center text-white
              transition-all duration-300 hover:bg-white/20
              ${index === 0 ? 'rounded-t-2xl' : ''}
              ${index === toolbarItems.length - 1 ? 'rounded-b-2xl' : ''}
              ${activeItem === item.id ? 'bg-white/30' : ''}
            `}
            title={item.label}
          >
            <div className="relative z-10">
              {item.icon}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
