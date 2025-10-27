'use client';

import { useState } from 'react';
import {
  useAnalyticsSummary,
  useInfrastructureByCategory,
  useAccidentSummaryBySeverity,
  usePublicTransportSummary,
  useAirQualityRanking,
  useWaterQualityRanking
} from '@/hooks/api/useAnalyticsQuery';
import {
  BarChart3,
  Users,
  Building2,
  AlertTriangle,
  Bus,
  Wind,
  Droplets,
  Activity,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'environment' | 'transport' | 'safety'>('overview');

  const { data: summaryResponse, isLoading: loadingSummary } = useAnalyticsSummary();
  const { data: infrastructureResponse } = useInfrastructureByCategory();
  const { data: accidentsResponse } = useAccidentSummaryBySeverity();
  const { data: publicTransportResponse } = usePublicTransportSummary();
  const { data: airQualityResponse } = useAirQualityRanking();
  const { data: waterQualityResponse } = useWaterQualityRanking();

  // Extract nested data
  const summary = summaryResponse?.data?.data || summaryResponse?.data;
  const infrastructure = infrastructureResponse?.data?.data || infrastructureResponse?.data;
  const accidents = accidentsResponse?.data?.data || accidentsResponse?.data;
  const publicTransport = publicTransportResponse?.data?.data || publicTransportResponse?.data;
  const airQuality = airQualityResponse?.data?.data || airQualityResponse?.data;
  const waterQuality = waterQualityResponse?.data?.data || waterQualityResponse?.data;

  const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db'];

  if (loadingSummary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-gray-700" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Phân tích dữ liệu hệ thống GIS</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 p-3">
              {[
                { id: 'overview', label: 'Tổng quan', icon: Activity },
                { id: 'environment', label: 'Môi trường', icon: Wind },
                { id: 'transport', label: 'Giao thông', icon: Bus },
                { id: 'safety', label: 'An toàn', icon: AlertTriangle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Quận/Huyện"
                    value={summary?.totalDistricts?.toLocaleString() || 'N/A'}
                    icon={Building2}
                  />
                  <StatCard
                    title="Cơ sở hạ tầng"
                    value={summary?.totalInfrastructures?.toLocaleString() || 'N/A'}
                    icon={Building2}
                  />
                  <StatCard
                    title="Tuyến giao thông"
                    value={summary?.totalTrafficRoutes?.toLocaleString() || 'N/A'}
                    icon={Bus}
                  />
                  <StatCard
                    title="Quy hoạch đô thị"
                    value={summary?.totalUrbanPlans?.toLocaleString() || 'N/A'}
                    icon={Activity}
                  />
                </div>

                {/* Infrastructure Distribution Chart */}
                {infrastructure && Array.isArray(infrastructure) && infrastructure.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Phân bố cơ sở hạ tầng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={infrastructure}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#374151" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'environment' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Chất lượng môi trường</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Air Quality Chart */}
                  {airQuality && Array.isArray(airQuality) && airQuality.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-700" />
                        Chất lượng không khí (PM2.5)
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={airQuality.slice(0, 5)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis dataKey="districtName" type="category" tick={{ fontSize: 11 }} width={80} />
                          <Tooltip />
                          <Bar dataKey="avgPm25" fill="#6b7280" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Water Quality Chart */}
                  {waterQuality && Array.isArray(waterQuality) && waterQuality.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-gray-700" />
                        Chất lượng nước (CI)
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={waterQuality.slice(0, 5)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis dataKey="districtName" type="category" tick={{ fontSize: 11 }} width={80} />
                          <Tooltip />
                          <Bar dataKey="avgContaminationIndex" fill="#374151" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'transport' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Giao thông công cộng</h2>
                
                {publicTransport && Array.isArray(publicTransport) && publicTransport.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Phân bố tuyến giao thông công cộng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={publicTransport}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mode" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="routeCount" fill="#374151" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'safety' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">An toàn giao thông</h2>
                
                {accidents && Array.isArray(accidents) && accidents.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tai nạn theo mức độ nghiêm trọng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={accidents}
                          dataKey="count"
                          nameKey="severity"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {accidents.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-gray-700" />
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
