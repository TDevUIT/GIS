'use client';

import { usePublicTransportCapacity, useMostFrequentRoutes } from '@/hooks/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bus, TrendingUp, Users, Clock, Loader2 } from 'lucide-react';

interface CapacityItem {
  mode: string;
  capacity: number;
  currentLoad: number;
  routeCount: number;
  utilizationRate: string;
}

interface RouteItem {
  routeNumber: string;
  routeName: string;
  frequency: number;
  averagePassengers: number;
  peakHours: string;
}

export default function PublicTransportCapacity() {
  const { data: capacityResponse, isLoading: loadingCapacity } = usePublicTransportCapacity();
  const { data: routesResponse, isLoading: loadingRoutes } = useMostFrequentRoutes();

  const capacityData = capacityResponse?.data?.data || capacityResponse?.data || [];
  const frequentRoutes = routesResponse?.data?.data || routesResponse?.data || [];

  if (loadingCapacity || loadingRoutes) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Transform capacity data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedCapacity: CapacityItem[] = Array.isArray(capacityData) ? capacityData.map((item: any) => ({
    ...item,
    utilizationRate: ((item.currentLoad / item.capacity) * 100).toFixed(1)
  })) : [
    { mode: 'Xe buýt', capacity: 5000, currentLoad: 4200, routeCount: 120, utilizationRate: '84.0' },
    { mode: 'Metro', capacity: 3000, currentLoad: 2400, routeCount: 5, utilizationRate: '80.0' },
    { mode: 'Xe đạp công cộng', capacity: 1000, currentLoad: 650, routeCount: 50, utilizationRate: '65.0' },
    { mode: 'Taxi', capacity: 2000, currentLoad: 1600, routeCount: 0, utilizationRate: '80.0' },
  ];

  const transformedRoutes: RouteItem[] = Array.isArray(frequentRoutes) && frequentRoutes.length > 0 ? frequentRoutes : [
    { routeNumber: '01', routeName: 'Bến Thành - Chợ Lớn', frequency: 120, averagePassengers: 850, peakHours: '7-9, 17-19' },
    { routeNumber: '03', routeName: 'Sài Gòn - Thủ Đức', frequency: 90, averagePassengers: 720, peakHours: '6-8, 17-19' },
    { routeNumber: '05', routeName: 'Quận 1 - Bình Thạnh', frequency: 80, averagePassengers: 680, peakHours: '7-9, 18-20' },
    { routeNumber: '09', routeName: 'Bến xe Miền Đông', frequency: 75, averagePassengers: 650, peakHours: '6-8, 16-18' },
    { routeNumber: '11', routeName: 'Tân Sơn Nhất', frequency: 70, averagePassengers: 600, peakHours: '5-7, 16-18' },
  ];

  // Calculate totals
  const totalCapacity = transformedCapacity.reduce((sum: number, item: CapacityItem) => sum + (item.capacity || 0), 0);
  const totalCurrentLoad = transformedCapacity.reduce((sum: number, item: CapacityItem) => sum + (item.currentLoad || 0), 0);
  const overallUtilization = ((totalCurrentLoad / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bus className="w-6 h-6 text-gray-700" />
          Phân tích Công suất Giao thông Công cộng
        </h2>
        <p className="text-gray-500 mt-1">Đánh giá hiệu suất và tuyến đường thường xuyên</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Bus className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tổng công suất</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalCapacity.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Hiện tại</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalCurrentLoad.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tỷ lệ sử dụng</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {overallUtilization}%
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Tuyến hoạt động</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {transformedRoutes.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity by Mode */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Công suất theo Phương thức</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformedCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mode" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#9ca3af" name="Công suất" radius={[4, 4, 0, 0]} />
              <Bar dataKey="currentLoad" fill="#374151" name="Hiện tại" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tỷ lệ Sử dụng (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformedCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mode" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="utilizationRate" fill="#374151" name="Tỷ lệ (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Frequent Routes */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          Top 5 Tuyến Xe Thường xuyên nhất
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transformedRoutes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="routeNumber" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="frequency" fill="#6b7280" name="Tần suất/ngày" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="averagePassengers" fill="#374151" name="TB hành khách" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết Công suất</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Phương thức</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Công suất</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Hiện tại</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transformedCapacity.map((item: CapacityItem, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{item.mode}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {item.capacity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-600">
                    {item.currentLoad.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`font-semibold ${
                      parseFloat(item.utilizationRate) > 90 ? 'text-red-600' :
                      parseFloat(item.utilizationRate) > 75 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {item.utilizationRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Frequent Routes Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết Tuyến Xe</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Tuyến</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Tên</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Tần suất</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">HK TB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transformedRoutes.map((item: RouteItem, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{item.routeNumber}</td>
                    <td className="px-4 py-2 text-gray-700">{item.routeName}</td>
                    <td className="px-4 py-2 text-right text-gray-900">
                      {item.frequency}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">
                      {item.averagePassengers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Peak Hours Info */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Giờ Cao điểm theo Tuyến</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedRoutes.slice(0, 6).map((route: RouteItem, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-900 text-white rounded flex items-center justify-center font-bold text-sm">
                  {route.routeNumber}
                </div>
                <span className="font-medium text-gray-900">{route.routeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{route.peakHours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
