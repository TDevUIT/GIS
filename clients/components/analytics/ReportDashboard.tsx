'use client';

import { useAnalyticsSummary } from '@/hooks/api';
import { Loader2, Building2, Bus, Activity } from 'lucide-react';

export default function ReportDashboard() {
  const { data: summaryResponse, isLoading } = useAnalyticsSummary();
  const summary = summaryResponse?.data?.data || summaryResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan Báo cáo</h2>
        <p className="text-gray-500 mt-1">Thống kê tổng quan từ dữ liệu Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Quận/Huyện"
          value={summary?.totalDistricts?.toLocaleString() || '0'}
          icon={Building2}
          color="bg-blue-500"
        />
        <StatCard
          title="Cơ sở hạ tầng"
          value={summary?.totalInfrastructures?.toLocaleString() || '0'}
          icon={Building2}
          color="bg-green-500"
        />
        <StatCard
          title="Tuyến giao thông"
          value={summary?.totalTrafficRoutes?.toLocaleString() || '0'}
          icon={Bus}
          color="bg-purple-500"
        />
        <StatCard
          title="Quy hoạch đô thị"
          value={summary?.totalUrbanPlans?.toLocaleString() || '0'}
          icon={Activity}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`${color} p-3 rounded-lg text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
