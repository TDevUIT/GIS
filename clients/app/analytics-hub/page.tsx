'use client';

import Link from 'next/link';
import { 
  FileText, 
  AlertTriangle, 
  Wind, 
  Users, 
  Bus, 
  Mountain, 
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

const analyticsModules = [
  {
    id: 'reports',
    title: 'Báo cáo & Phân tích',
    description: 'Hệ thống quản lý báo cáo và phân tích toàn diện - 7 modules',
    icon: FileText,
    color: 'bg-blue-500',
    href: '/reports',
    priority: 'All',
    features: ['Report Management', 'Analytics Dashboard', 'Accidents', 'Environment', 'Demographics', 'Transport', 'Terrain']
  },
  {
    id: 'maps',
    title: 'Bản đồ GIS',
    description: 'Xem và phân tích dữ liệu trên bản đồ',
    icon: Activity,
    color: 'bg-green-500',
    href: '/maps',
    priority: 'Core',
    features: ['Interactive Maps', 'Layer Controls', 'Analytics Panel', 'Info Toolbar']
  },
];

const apiModules = [
  {
    category: 'Analytics APIs',
    apis: [
      { name: 'useAnalyticsSummary', status: 'active', usage: 'Dashboard, Maps' },
      { name: 'useInfrastructureByCategory', status: 'active', usage: 'Dashboard, Maps' },
      { name: 'useAccidentsByTimeOfDay', status: 'active', usage: 'Reports - Accidents' },
      { name: 'useAccidentsByDayOfWeek', status: 'active', usage: 'Reports - Accidents' },
      { name: 'useTrafficRiskAssessment', status: 'active', usage: 'Reports - Accidents' },
      { name: 'useAirQualityHistory', status: 'active', usage: 'Reports - Environment' },
      { name: 'useWaterQualityHistory', status: 'active', usage: 'Reports - Environment' },
      { name: 'useDemographicsSummary', status: 'active', usage: 'Reports - Demographics' },
      { name: 'useHouseholdsSummary', status: 'active', usage: 'Reports - Demographics' },
      { name: 'usePublicTransportCapacity', status: 'active', usage: 'Reports - Transport' },
      { name: 'useMostFrequentRoutes', status: 'active', usage: 'Reports - Transport' },
      { name: 'useTerrainSummary', status: 'active', usage: 'Reports - Terrain' },
      { name: 'useLandslideRiskAreas', status: 'active', usage: 'Reports - Terrain' },
      { name: 'useFloodProneAreas', status: 'active', usage: 'Reports - Terrain' },
      { name: 'useSoilTypeDistribution', status: 'active', usage: 'Reports - Terrain' },
    ]
  },
  {
    category: 'Report APIs',
    apis: [
      { name: 'useReports', status: 'active', usage: 'Reports Dashboard' },
      { name: 'useGenerateReport', status: 'active', usage: 'Reports Dashboard' },
      { name: 'useDeleteReport', status: 'active', usage: 'Reports Dashboard' },
      { name: 'useReportStatus', status: 'active', usage: 'Reports Dashboard' },
    ]
  }
];

export default function AnalyticsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Hub
          </h1>
          <p className="text-lg text-gray-600">
            Trung tâm phân tích và báo cáo dữ liệu GIS
          </p>
        </div>

        {/* Main Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modules Chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsModules.map((module) => (
              <Link
                key={module.id}
                href={module.href}
                className="group bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${module.color} p-3 rounded-lg text-white`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-gray-900">
                      {module.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {module.priority}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {module.description}
                </p>
                <div className="space-y-1">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* API Integration Status */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Integration Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiModules.map((module) => (
              <div key={module.category} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {module.category}
                </h3>
                <div className="space-y-2">
                  {module.apis.map((api, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono text-gray-700">{api.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{api.usage}</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full" title={api.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">System Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold mb-1">7</div>
              <div className="text-gray-300 text-sm">Modules tích hợp</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">19</div>
              <div className="text-gray-300 text-sm">API Hooks hoạt động</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">20+</div>
              <div className="text-gray-300 text-sm">Biểu đồ tương tác</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-gray-300 text-sm">Main Pages</div>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm mb-3">
                Xem hướng dẫn chi tiết về cách sử dụng các APIs và components trong file:
              </p>
              <code className="text-sm bg-white px-3 py-1 rounded border border-blue-200">
                clients/PRIORITY_FEATURES_GUIDE.md
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
