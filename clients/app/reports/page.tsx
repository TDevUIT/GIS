'use client';

import ReportDashboard from '@/components/analytics/ReportDashboard';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import TerrainRiskAnalysis from '@/components/analytics/TerrainRiskAnalysis';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Hệ thống Báo cáo & Phân tích Toàn diện</h1>
          <p className="text-gray-500 mt-1">Quản lý báo cáo và phân tích dữ liệu chi tiết - 7 modules chính</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <ReportDashboard />
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <AnalyticsDashboard />
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <TerrainRiskAnalysis />
        </div>
      </div>
    </div>
  );
}
