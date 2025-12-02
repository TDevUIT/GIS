'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  onClose?: () => void
  variant?: 'inline' | 'toast' | 'full'
}

export default function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  onClose,
  variant = 'inline'
}: ErrorMessageProps) {
  
  if (variant === 'toast') {
    return (
      <div className="fixed top-20 right-6 z-[1050] bg-white rounded-lg shadow-lg border border-red-200 p-4 min-w-[320px] max-w-[400px] animate-in slide-in-from-right">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-red-900 text-sm">{title}</h4>
            <p className="text-xs text-red-700 mt-0.5">{message}</p>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-xs font-medium text-red-700 hover:text-red-900 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Try Again
              </button>
            )}
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    )
  }
  
  if (variant === 'full') {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }
  
  // Inline variant (default)
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-900">{title}</p>
          <p className="text-xs text-red-700 mt-0.5">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-medium text-red-700 hover:text-red-900 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
