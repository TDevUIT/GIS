'use client';

import { useState } from 'react';
import { useDemographicsSummary, useHouseholdsSummary } from '@/hooks/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Home, Baby, User, Users2, Loader2 } from 'lucide-react';

const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];

export default function DemographicsAnalysis() {
  const [selectedPopulation, setSelectedPopulation] = useState('pop-1');

  const { data: demographicsResponse, isLoading: loadingDemo } = useDemographicsSummary(selectedPopulation);
  const { data: householdsResponse, isLoading: loadingHouse } = useHouseholdsSummary(selectedPopulation);

  const demographics = demographicsResponse?.data?.data || demographicsResponse?.data;
  const households = householdsResponse?.data?.data || householdsResponse?.data;

  if (loadingDemo || loadingHouse) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Transform demographics data for charts
  const ageGroups = demographics?.ageGroups || [
    { ageRange: '0-14', count: 1200, percentage: 18 },
    { ageRange: '15-24', count: 1500, percentage: 22 },
    { ageRange: '25-44', count: 2000, percentage: 30 },
    { ageRange: '45-64', count: 1500, percentage: 22 },
    { ageRange: '65+', count: 800, percentage: 8 },
  ];

  const genderData = demographics?.genderDistribution || [
    { name: 'Nam', value: 3500, percentage: 52 },
    { name: 'Nữ', value: 3200, percentage: 48 },
  ];

  const householdSizes = households?.householdSizes || [
    { size: '1 người', count: 450 },
    { size: '2 người', count: 800 },
    { size: '3-4 người', count: 1200 },
    { size: '5-6 người', count: 600 },
    { size: '7+ người', count: 200 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-700" />
            Phân tích Nhân khẩu học & Hộ gia đình
          </h2>
          <p className="text-gray-500 mt-1">Thống kê dân số và cơ cấu hộ gia đình</p>
        </div>

        <select
          value={selectedPopulation}
          onChange={(e) => setSelectedPopulation(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="pop-1">Khu vực 1</option>
          <option value="pop-2">Khu vực 2</option>
          <option value="pop-3">Khu vực 3</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tổng dân số</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {demographics?.totalPopulation?.toLocaleString() || '6,700'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tổng hộ gia đình</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {households?.totalHouseholds?.toLocaleString() || '3,250'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users2 className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">TB người/hộ</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {households?.averageHouseholdSize?.toFixed(1) || '2.1'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Baby className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tuổi trung bình</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {demographics?.averageAge?.toFixed(0) || '35'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700" />
            Phân bố theo Độ tuổi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="ageRange" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#374151" radius={[4, 4, 0, 0]} name="Số người" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            Phân bố theo Giới tính
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.percentage}%`}
              >
                {genderData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Household Sizes */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-700" />
            Quy mô Hộ gia đình
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={householdSizes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="size" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#6b7280" radius={[0, 4, 4, 0]} name="Số hộ" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education Level (if available) */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trình độ Học vấn</h3>
          <div className="space-y-3">
            {[
              { level: 'Tiểu học', count: 800, percentage: 12 },
              { level: 'THCS', count: 1200, percentage: 18 },
              { level: 'THPT', count: 2000, percentage: 30 },
              { level: 'Cao đẳng', count: 1500, percentage: 22 },
              { level: 'Đại học+', count: 1200, percentage: 18 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{item.level}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${item.percentage * 2}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-16 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết Độ tuổi</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Nhóm tuổi</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Số người</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ageGroups.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{item.ageRange}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {item.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-600">
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Household Types */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Loại hình Hộ gia đình</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Loại hình</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Số hộ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { type: 'Hộ đơn thân', count: 450 },
                { type: 'Cặp vợ chồng', count: 800 },
                { type: 'Gia đình hạt nhân', count: 1200 },
                { type: 'Nhiều thế hệ', count: 600 },
                { type: 'Khác', count: 200 },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{item.type}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {item.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
