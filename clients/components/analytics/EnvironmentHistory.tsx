'use client';

import { useState } from 'react';
import { useAirQualityHistory, useWaterQualityHistory } from '@/hooks/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Wind, Droplets, TrendingDown, TrendingUp, Minus, Loader2 } from 'lucide-react';

export default function EnvironmentHistory() {
  const [selectedDistrict, setSelectedDistrict] = useState('district-1');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const { data: airQualityResponse, isLoading: loadingAir } = useAirQualityHistory(selectedDistrict);
  const { data: waterQualityResponse, isLoading: loadingWater } = useWaterQualityHistory(selectedDistrict);

  const airQualityData = airQualityResponse?.data?.data || airQualityResponse?.data || [];
  const waterQualityData = waterQualityResponse?.data?.data || waterQualityResponse?.data || [];

  if (loadingAir || loadingWater) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Transform data for charts
  const transformedAirData = Array.isArray(airQualityData) ? airQualityData.map((item: { measuredAt?: string; date?: string; pm25?: number }) => ({
    ...item,
    date: new Date(item.measuredAt || item.date || '').toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    })
  })) : [];

  const transformedWaterData = Array.isArray(waterQualityData) ? waterQualityData.map((item: { measuredAt?: string; date?: string; contaminationIndex?: number }) => ({
    ...item,
    date: new Date(item.measuredAt || item.date || '').toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    })
  })) : [];

  // Calculate trends
  const getAirTrend = () => {
    if (transformedAirData.length < 2) return 'stable';
    const first = transformedAirData[0].pm25 || 0;
    const last = transformedAirData[transformedAirData.length - 1].pm25 || 0;
    if (last > first * 1.1) return 'up';
    if (last < first * 0.9) return 'down';
    return 'stable';
  };

  const getWaterTrend = () => {
    if (transformedWaterData.length < 2) return 'stable';
    const first = transformedWaterData[0].contaminationIndex || 0;
    const last = transformedWaterData[transformedWaterData.length - 1].contaminationIndex || 0;
    if (last > first * 1.1) return 'up';
    if (last < first * 0.9) return 'down';
    return 'stable';
  };

  const airTrend = getAirTrend();
  const waterTrend = getWaterTrend();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Tăng';
      case 'down':
        return 'Giảm';
      default:
        return 'Ổn định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử Môi trường</h2>
          <p className="text-gray-500 mt-1">Theo dõi biến đổi chất lượng môi trường theo thời gian</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="district-1">Quận 1</option>
            <option value="district-2">Quận 2</option>
            <option value="district-3">Quận 3</option>
            <option value="district-4">Quận 4</option>
            <option value="district-5">Quận 5</option>
          </select>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: 'week', label: 'Tuần' },
              { value: 'month', label: 'Tháng' },
              { value: 'year', label: 'Năm' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as 'week' | 'month' | 'year')}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === option.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-gray-700" />
              <div>
                <h3 className="font-semibold text-gray-900">Chất lượng Không khí</h3>
                <p className="text-xs text-gray-500">PM2.5 (μg/m³)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(airTrend)}
              <span className="text-sm font-medium text-gray-600">
                {getTrendText(airTrend)}
              </span>
            </div>
          </div>
          {transformedAirData.length > 0 && (
            <div className="text-3xl font-bold text-gray-900">
              {transformedAirData[transformedAirData.length - 1]?.pm25?.toFixed(1) || 'N/A'}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-6 h-6 text-gray-700" />
              <div>
                <h3 className="font-semibold text-gray-900">Chất lượng Nước</h3>
                <p className="text-xs text-gray-500">Chỉ số ô nhiễm (CI)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(waterTrend)}
              <span className="text-sm font-medium text-gray-600">
                {getTrendText(waterTrend)}
              </span>
            </div>
          </div>
          {transformedWaterData.length > 0 && (
            <div className="text-3xl font-bold text-gray-900">
              {transformedWaterData[transformedWaterData.length - 1]?.contaminationIndex?.toFixed(1) || 'N/A'}
            </div>
          )}
        </div>
      </div>

      {/* Air Quality Chart */}
      {transformedAirData.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-gray-700" />
            Biến động Chất lượng Không khí
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transformedAirData}>
              <defs>
                <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="pm25"
                stroke="#6b7280"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPm25)"
                name="PM2.5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Water Quality Chart */}
      {transformedWaterData.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-gray-700" />
            Biến động Chất lượng Nước
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transformedWaterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="contaminationIndex"
                stroke="#374151"
                strokeWidth={2}
                name="Chỉ số ô nhiễm"
                dot={{ fill: '#374151', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Air Quality Table */}
        {transformedAirData.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chi tiết Không khí</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Ngày</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">PM2.5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transformedAirData.slice(-10).reverse().map((item: { date: string; pm25?: number }, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{item.date}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">
                        {item.pm25?.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Water Quality Table */}
        {transformedWaterData.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chi tiết Nước</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Ngày</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">CI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transformedWaterData.slice(-10).reverse().map((item: { date: string; contaminationIndex?: number }, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{item.date}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">
                        {item.contaminationIndex?.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
