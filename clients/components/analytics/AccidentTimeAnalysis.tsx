'use client';

import { useAccidentsByTimeOfDay, useAccidentsByDayOfWeek, useTrafficRiskAssessment } from '@/hooks/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, Calendar, TrendingUp, Loader2 } from 'lucide-react';

const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#f9fafb'];

export default function AccidentTimeAnalysis() {
  const { data: timeOfDayResponse, isLoading: loadingTime } = useAccidentsByTimeOfDay();
  const { data: dayOfWeekResponse, isLoading: loadingDay } = useAccidentsByDayOfWeek();
  const { data: riskResponse, isLoading: loadingRisk } = useTrafficRiskAssessment();

  const timeOfDayData = timeOfDayResponse?.data?.data || timeOfDayResponse?.data || [];
  const dayOfWeekData = dayOfWeekResponse?.data?.data || dayOfWeekResponse?.data || [];
  const riskData = riskResponse?.data?.data || riskResponse?.data || [];

  if (loadingTime || loadingDay || loadingRisk) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Transform day of week data to Vietnamese
  const dayMap: { [key: string]: string } = {
    'MONDAY': 'Thứ 2',
    'TUESDAY': 'Thứ 3',
    'WEDNESDAY': 'Thứ 4',
    'THURSDAY': 'Thứ 5',
    'FRIDAY': 'Thứ 6',
    'SATURDAY': 'Thứ 7',
    'SUNDAY': 'Chủ nhật',
  };

  const transformedDayData = Array.isArray(dayOfWeekData) ? dayOfWeekData.map((item: { dayOfWeek: string; count: number }) => ({
    ...item,
    dayName: dayMap[item.dayOfWeek] || item.dayOfWeek
  })): [];

  // Transform time of day data
  const transformedTimeData = Array.isArray(timeOfDayData) ? timeOfDayData.map((item: { hour: number; count: number }) => ({
    ...item,
    timeLabel: `${item.hour}:00`
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-gray-700" />
          Phân tích Tai nạn Theo Thời gian
        </h2>
        <p className="text-gray-500 mt-1">Thống kê và phân tích tai nạn giao thông</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tổng tai nạn</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Array.isArray(timeOfDayData)
              ? timeOfDayData.reduce((sum: number, item: { count?: number }) => sum + (item.count || 0), 0)
              : 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Giờ cao điểm</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Array.isArray(timeOfDayData) && timeOfDayData.length > 0
              ? `${timeOfDayData.reduce((max: { hour: number; count?: number }, item: { hour: number; count?: number }) =>
                  (item.count! > (max.count || 0) ? item : max), timeOfDayData[0]).hour}:00`
              : 'N/A'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Ngày nguy hiểm nhất</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {Array.isArray(transformedDayData) && transformedDayData.length > 0
              ? transformedDayData.reduce((max: { dayName: string; count?: number }, item: { dayName: string; count?: number }) =>
                  (item.count! > (max.count || 0) ? item : max), transformedDayData[0]).dayName
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time of Day Chart */}
        {Array.isArray(transformedTimeData) && transformedTimeData.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700" />
              Tai nạn theo Giờ trong Ngày
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transformedTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#374151"
                  strokeWidth={2}
                  name="Số tai nạn"
                  dot={{ fill: '#374151', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Day of Week Chart */}
        {Array.isArray(transformedDayData) && transformedDayData.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              Tai nạn theo Ngày trong Tuần
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dayName" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#374151" radius={[4, 4, 0, 0]} name="Số tai nạn" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Traffic Risk Assessment */}
      {Array.isArray(riskData) && riskData.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            Đánh giá Rủi ro Giao thông
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="count"
                  nameKey="riskLevel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {riskData.map((entry: { riskLevel: string; count: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Phân loại theo mức độ rủi ro</h4>
              {riskData.map((item: { riskLevel: string; count: number }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">{item.riskLevel}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.count}</div>
                    <div className="text-xs text-gray-500">khu vực</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
