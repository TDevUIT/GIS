'use client';

import { useState } from 'react';
import {
  useInfrastructureByCategory,
  useAccidentSummaryBySeverity,
  usePublicTransportSummary,
  useAnalyticsSummary
} from '@/hooks/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsPanelProps {
  onClose: () => void;
}

const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];

export default function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const [activeChart, setActiveChart] = useState<'infrastructure' | 'accidents' | 'transport'>('infrastructure');

  const { data: summaryResponse } = useAnalyticsSummary();
  const { data: infrastructureResponse } = useInfrastructureByCategory();
  const { data: accidentsResponse } = useAccidentSummaryBySeverity();
  const { data: publicTransportResponse } = usePublicTransportSummary();

  const summary = summaryResponse?.data?.data || summaryResponse?.data;
  const infrastructure = infrastructureResponse?.data?.data || infrastructureResponse?.data;
  const accidents = accidentsResponse?.data?.data || accidentsResponse?.data;
  const publicTransport = publicTransportResponse?.data?.data || publicTransportResponse?.data;

  return (
    <div className="absolute top-6 right-28 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Thá»‘ng kÃª</h3>
        </div>
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Quáº­n/Huyá»‡n</div>
            <div className="text-xl font-bold text-gray-900">
              {summary?.totalDistricts || 0}
            </div>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">CÆ¡ sá»Ÿ háº¡ táº§ng</div>
            <div className="text-xl font-bold text-gray-900">
              {summary?.totalInfrastructures || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'infrastructure', label: 'Háº¡ táº§ng' },
          { id: 'accidents', label: 'Tai náº¡n' },
          { id: 'transport', label: 'GT cÃ´ng cá»™ng' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id as any)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeChart === tab.id
                ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeChart === 'infrastructure' && infrastructure && Array.isArray(infrastructure) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">PhÃ¢n bá»‘ cÆ¡ sá»Ÿ háº¡ táº§ng</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={infrastructure}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#374151" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'accidents' && accidents && Array.isArray(accidents) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Tai náº¡n theo má»©c Ä‘á»™</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={accidents}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

        {activeChart === 'transport' && publicTransport && Array.isArray(publicTransport) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Giao thÃ´ng cÃ´ng cá»™ng</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={publicTransport}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mode" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
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
