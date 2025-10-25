'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative pointer-events-auto max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm địa điểm..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  )
}
