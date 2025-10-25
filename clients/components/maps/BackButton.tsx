'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BackButton() {
  return (
    <div className="absolute left-6 top-6 z-[1000]">
      <Link href="/">
        <button
          className="group flex items-center overflow-hidden px-2.5 py-2 bg-white hover:bg-blue-50 transition-all duration-300 rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:pr-4"
          title="Về trang chủ"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-colors duration-300 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap text-xs font-medium text-gray-700 group-hover:text-blue-600 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out overflow-hidden">
            Back to Home
          </span>
        </button>
      </Link>
    </div>
  )
}
