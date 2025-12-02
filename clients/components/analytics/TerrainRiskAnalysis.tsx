'use client';

import { useTerrainSummary, useLandslideRiskAreas, useFloodProneAreas, useSoilTypeDistribution } from '@/hooks/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Mountain, AlertTriangle, Droplets, Layers, Loader2 } from 'lucide-react';

const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'];

interface LandslideArea {
  district: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  area: number;
  slope: number;
  affectedPopulation: number;
}

interface FloodArea {
  district: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  area: number;
  elevation: number;
  affectedPopulation: number;
}

interface SoilType {
  soilType: string;
  area: number;
  percentage: number;
  suitability: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type AffectedArea = LandslideArea | FloodArea;

export default function TerrainRiskAnalysis() {
  const { isLoading: loadingTerrain } = useTerrainSummary();
  const { data: landslideResponse, isLoading: loadingLandslide } = useLandslideRiskAreas(30);
  const { data: floodResponse, isLoading: loadingFlood } = useFloodProneAreas(5);
  const { data: soilResponse, isLoading: loadingSoil } = useSoilTypeDistribution();

  const landslideAreas = landslideResponse?.data?.data || landslideResponse?.data || [];
  const floodAreas = floodResponse?.data?.data || floodResponse?.data || [];
  const soilTypes = soilResponse?.data?.data || soilResponse?.data || [];

  if (loadingTerrain || loadingLandslide || loadingFlood || loadingSoil) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Sample data if API returns empty
  const sampleLandslideAreas: LandslideArea[] = Array.isArray(landslideAreas) && landslideAreas.length > 0 ? landslideAreas : [
    { district: 'Quận 1', riskLevel: 'HIGH', area: 12.5, slope: 35, affectedPopulation: 5000 },
    { district: 'Quận 3', riskLevel: 'MEDIUM', area: 8.3, slope: 28, affectedPopulation: 3500 },
    { district: 'Quận 5', riskLevel: 'HIGH', area: 15.7, slope: 40, affectedPopulation: 6200 },
    { district: 'Quận 7', riskLevel: 'MEDIUM', area: 10.2, slope: 25, affectedPopulation: 4100 },
    { district: 'Quận 9', riskLevel: 'LOW', area: 5.8, slope: 18, affectedPopulation: 2000 },
  ];

  const sampleFloodAreas: FloodArea[] = Array.isArray(floodAreas) && floodAreas.length > 0 ? floodAreas : [
    { district: 'Quận 2', riskLevel: 'HIGH', area: 25.4, elevation: 2, affectedPopulation: 12000 },
    { district: 'Quận 4', riskLevel: 'MEDIUM', area: 18.6, elevation: 4, affectedPopulation: 8500 },
    { district: 'Quận 6', riskLevel: 'HIGH', area: 30.2, elevation: 1.5, affectedPopulation: 15000 },
    { district: 'Quận 8', riskLevel: 'MEDIUM', area: 20.1, elevation: 3.5, affectedPopulation: 9200 },
    { district: 'Thủ Đức', riskLevel: 'LOW', area: 12.3, elevation: 6, affectedPopulation: 4500 },
  ];

  const sampleSoilTypes: SoilType[] = Array.isArray(soilTypes) && soilTypes.length > 0 ? soilTypes : [
    { soilType: 'Đất phù sa', area: 450, percentage: 35, suitability: 'Nông nghiệp' },
    { soilType: 'Đất sét', area: 320, percentage: 25, suitability: 'Xây dựng' },
    { soilType: 'Đất cát', area: 230, percentage: 18, suitability: 'Chống xói mòn' },
    { soilType: 'Đất laterit', area: 180, percentage: 14, suitability: 'Trồng cây' },
    { soilType: 'Đất mặn', area: 100, percentage: 8, suitability: 'Hạn chế' },
  ];

  // Calculate risk statistics
  const highRiskLandslide = sampleLandslideAreas.filter((a: LandslideArea) => a.riskLevel === 'HIGH').length;
  const highRiskFlood = sampleFloodAreas.filter((a: FloodArea) => a.riskLevel === 'HIGH').length;
  const totalAffectedPopulation = [...sampleLandslideAreas, ...sampleFloodAreas]
    .reduce((sum: number, item: AffectedArea) => sum + (item.affectedPopulation || 0), 0);

  // Risk distribution
  const riskDistribution = [
    {
      name: 'Sạt lở đất',
      high: sampleLandslideAreas.filter((a: LandslideArea) => a.riskLevel === 'HIGH').length,
      medium: sampleLandslideAreas.filter((a: LandslideArea) => a.riskLevel === 'MEDIUM').length,
      low: sampleLandslideAreas.filter((a: LandslideArea) => a.riskLevel === 'LOW').length,
    },
    {
      name: 'Ngập lụt',
      high: sampleFloodAreas.filter((a: FloodArea) => a.riskLevel === 'HIGH').length,
      medium: sampleFloodAreas.filter((a: FloodArea) => a.riskLevel === 'MEDIUM').length,
      low: sampleFloodAreas.filter((a: FloodArea) => a.riskLevel === 'LOW').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mountain className="w-6 h-6 text-gray-700" />
          Phân tích Rủi ro Địa hình
        </h2>
        <p className="text-gray-500 mt-1">Đánh giá rủi ro sạt lở đất, ngập lụt và phân bố loại đất</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-600">Khu vực sạt lở cao</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{highRiskLandslide}</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-600">Khu vực ngập cao</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{highRiskFlood}</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Mountain className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Dân số ảnh hưởng</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalAffectedPopulation.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-600">Loại đất</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{sampleSoilTypes.length}</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố Mức độ Rủi ro</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" fill="#dc2626" name="Cao" stackId="a" />
            <Bar dataKey="medium" fill="#f59e0b" name="Trung bình" stackId="a" />
            <Bar dataKey="low" fill="#10b981" name="Thấp" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Landslide and Flood Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Landslide Risk Areas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Khu vực Rủi ro Sạt lở
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleLandslideAreas} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="area" fill="#6b7280" name="Diện tích (km²)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Flood Risk Areas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Khu vực Rủi ro Ngập lụt
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleFloodAreas} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="area" fill="#374151" name="Diện tích (km²)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Soil Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-700" />
            Phân bố Loại Đất
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sampleSoilTypes}
                dataKey="percentage"
                nameKey="soilType"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.soilType}: ${entry.percentage}%`}
              >
                {sampleSoilTypes.map((entry: SoilType, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mức độ Phù hợp</h3>
          <div className="space-y-3">
            {sampleSoilTypes.map((item: SoilType, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{item.soilType}</div>
                  <div className="text-sm text-gray-500">{item.suitability}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{item.area} km²</div>
                  <div className="text-sm text-gray-600">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Landslide Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết Sạt lở Đất</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Quận</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Độ dốc</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Diện tích</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Rủi ro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sampleLandslideAreas.map((item: LandslideArea, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{item.district}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.slope}°</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.area} km²</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                        item.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flood Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết Ngập lụt</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Quận</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Cao độ</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Diện tích</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-600">Rủi ro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sampleFloodAreas.map((item: FloodArea, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{item.district}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.elevation}m</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.area} km²</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                        item.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
