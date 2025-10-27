'use client';

import { useState } from 'react';
import ReportDashboard from '@/components/analytics/ReportDashboard';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AccidentTimeAnalysis from '@/components/analytics/AccidentTimeAnalysis';
import EnvironmentHistory from '@/components/analytics/EnvironmentHistory';
import DemographicsAnalysis from '@/components/analytics/DemographicsAnalysis';
import PublicTransportCapacity from '@/components/analytics/PublicTransportCapacity';
import TerrainRiskAnalysis from '@/components/analytics/TerrainRiskAnalysis';
import { FileText, AlertTriangle, Wind, Users, Bus, Mountain, BarChart3 } from 'lucide-react';

type TabId = 'reports' | 'analytics' | 'accidents' | 'environment' | 'demographics' | 'transport' | 'terrain';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('reports');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Hệ thống Báo cáo & Phân tích Toàn diện</h1>
          <p className="text-gray-500 mt-1">Quản lý báo cáo và phân tích dữ liệu chi tiết - 7 modules chính</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 p-3">
              {[
                { id: 'reports', label: 'Báo cáo', icon: FileText, priority: 1 },
                { id: 'analytics', label: 'Phân tích', icon: BarChart3, priority: 1 },
                { id: 'accidents', label: 'Tai nạn', icon: AlertTriangle, priority: 1 },
                { id: 'environment', label: 'Môi trường', icon: Wind, priority: 1 },
                { id: 'demographics', label: 'Nhân khẩu', icon: Users, priority: 2 },
                { id: 'transport', label: 'GT Công cộng', icon: Bus, priority: 2 },
                { id: 'terrain', label: 'Địa hình', icon: Mountain, priority: 3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`Priority ${tab.priority}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'reports' && <ReportDashboard />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'accidents' && <AccidentTimeAnalysis />}
            {activeTab === 'environment' && <EnvironmentHistory />}
            {activeTab === 'demographics' && <DemographicsAnalysis />}
            {activeTab === 'transport' && <PublicTransportCapacity />}
            {activeTab === 'terrain' && <TerrainRiskAnalysis />}
          </div>
        </div>
      </div>
    </div>
  );
}
