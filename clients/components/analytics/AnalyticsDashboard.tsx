'use client';

import {
  useAnalyticsSummary,
  useInfrastructureByCategory,
  usePublicTransportSummary,
  useAirQualityRanking,
  useWaterQualityRanking
} from '@/hooks/api';
import {
  BarChart3,
  Building2,
  Bus,
  Wind,
  Droplets,
  Activity,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const { data: summaryResponse, isLoading: loadingSummary } = useAnalyticsSummary();
  const { data: infrastructureResponse } = useInfrastructureByCategory();
  const { data: publicTransportResponse } = usePublicTransportSummary();
  const { data: airQualityResponse } = useAirQualityRanking();
  const { data: waterQualityResponse } = useWaterQualityRanking();

  const summary = summaryResponse?.data?.data || summaryResponse?.data;
  const infrastructure = infrastructureResponse?.data?.data || infrastructureResponse?.data;
  const publicTransport = publicTransportResponse?.data?.data || publicTransportResponse?.data;
  const airQuality = airQualityResponse?.data?.data || airQualityResponse?.data;
  const waterQuality = waterQualityResponse?.data?.data || waterQualityResponse?.data;

  if (loadingSummary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-gray-700" />
          Analytics Dashboard
        </h2>
        <p className="text-gray-500 mt-1">Phân tích dữ liệu hệ thống GIS</p>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Tổng quan hệ thống</h3>
        </div>

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

        {infrastructure && Array.isArray(infrastructure) && infrastructure.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố cơ sở hạ tầng
            </h4>
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

      {/* Environment Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Chất lượng môi trường</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {airQuality && Array.isArray(airQuality) && airQuality.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5 text-gray-700" />
                Chất lượng không khí (PM2.5)
              </h4>
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

          {waterQuality && Array.isArray(waterQuality) && waterQuality.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-gray-700" />
                Chất lượng nước (CI)
              </h4>
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

      {/* Transport Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Giao thông công cộng</h3>
        </div>

        {publicTransport && Array.isArray(publicTransport) && publicTransport.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố tuyến giao thông công cộng
            </h4>
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
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
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
