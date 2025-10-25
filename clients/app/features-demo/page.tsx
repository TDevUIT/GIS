'use client'

import { useState } from 'react'
import { 
  FEATURE_CATEGORIES, 
  FeatureAction,
  getCategoryById,
  getAllActions 
} from '@/constants/featureCategories'
import { Code, Sparkles, Layout, Layers } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export default function FeaturesDemo() {
  const [selectedAction, setSelectedAction] = useState<FeatureAction | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const totalActions = getAllActions().length
  const analyticsCount = getAllActions().filter(a => a.badge === 'Analytics').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Map Features Showcase</h1>
          </div>
          <p className="text-purple-100 text-lg max-w-3xl">
            Comprehensive UI/UX system for all API services. Explore {totalActions} features 
            across {FEATURE_CATEGORIES.length} categories, including {analyticsCount} advanced analytics.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{FEATURE_CATEGORIES.length}</div>
              <div className="text-purple-100 text-sm">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{totalActions}</div>
              <div className="text-purple-100 text-sm">Features</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{analyticsCount}</div>
              <div className="text-purple-100 text-sm">Analytics</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <Layout className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Feature Toolbar</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive sidebar with all features organized by category. Search and filter capabilities.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
            <Layers className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Quick Access</h3>
            <p className="text-gray-600 text-sm">
              Top toolbar with 7 most-used features for instant access without opening menus.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <Code className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Service Integration</h3>
            <p className="text-gray-600 text-sm">
              Each feature mapped to API service. Ready for backend integration.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6" />
            Feature Categories
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_CATEGORIES.map((category) => {
              const CategoryIcon = category.icon
              const isActive = activeCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(isActive ? null : category.id)}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left border-2 ${
                    isActive ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                  }`}
                >
                  <div className={`bg-gradient-to-br ${category.gradient} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700">
                      {category.actions.length} features
                    </span>
                    {isActive && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Category Details */}
        {activeCategory && (
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            {(() => {
              const category = getCategoryById(activeCategory)
              if (!category) return null
              
              const CategoryIcon = category.icon
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`bg-gradient-to-br ${category.gradient} w-16 h-16 rounded-xl flex items-center justify-center`}>
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.actions.map((action) => {
                      const ActionIcon = action.icon
                      const isSelected = selectedAction?.id === action.id
                      
                      return (
                        <button
                          key={action.id}
                          onClick={() => setSelectedAction(isSelected ? null : action)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center flex-shrink-0`}>
                              <ActionIcon className={`w-5 h-5 text-${action.color}-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{action.name}</h4>
                                {action.badge && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                    {action.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                                {action.service}()
                              </code>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Implementation Guide */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-6 h-6" />
            Implementation Guide
          </h3>
          <p className="text-gray-300 mb-6">
            All features are UI-only and ready for backend integration. Each button is mapped to its corresponding service function.
          </p>
          
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">// Example integration:</div>
            <div className="text-blue-300">const handleFeatureSelect = (action: FeatureAction) =&gt; {'{'}</div>
            <div className="ml-4 text-gray-300">console.log('Calling:', action.service)</div>
            <div className="ml-4 text-gray-300">// Import and call the actual service</div>
            <div className="ml-4 text-yellow-300">import('{`@/services/${'{service}'}`}').then(module =&gt; {'{'}</div>
            <div className="ml-8 text-gray-300">module[action.service]().then(data =&gt; {'{'}</div>
            <div className="ml-12 text-purple-300">// Display data on map</div>
            <div className="ml-8 text-gray-300">{'}'})</div>
            <div className="ml-4 text-yellow-300">{'}'})</div>
            <div className="text-blue-300">{'}'}</div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link 
              href={ROUTES.MAPS.INDEX} 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              View on Map
            </Link>
            <a 
              href="/components/maps/FEATURES_README.md" 
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Read Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
