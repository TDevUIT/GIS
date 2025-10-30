'use client';

import { useAnalyticsSummary } from '@/hooks/api';
import { FileText, Loader2, Building2, Bus, Users, Activity, TrendingUp, BarChart } from 'lucide-react';

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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan Báo cáo</h2>
        <p className="text-gray-500 mt-1">Thống kê tổng quan từ dữ liệu Analytics</p>
      </div>

      {/* Summary Cards */}
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

      {/* Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <FileText className="w-12 h-12 text-gray-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Báo cáo từ dữ liệu Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              Dữ liệu được tổng hợp từ API Analytics. Sử dụng các tabs khác để xem phân tích chi tiết:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <span><strong>Phân tích:</strong> Xem dashboard analytics với biểu đồ tương tác</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span><strong>Tai nạn:</strong> Phân tích tai nạn theo thời gian và độ nghiêm trọng</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span><strong>Môi trường:</strong> Lịch sử chất lượng không khí và nước</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLinkCard
          title="Xem Analytics Dashboard"
          description="Dashboard phân tích tổng quan với biểu đồ"
          icon={BarChart}
          onClick={() => {}}
        />
        <QuickLinkCard
          title="Xuất dữ liệu"
          description="Xuất dữ liệu analytics sang file"
          icon={FileText}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
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

interface QuickLinkCardProps {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
}

function QuickLinkCard({ title, description, icon: Icon, onClick }: QuickLinkCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-gray-600 group-hover:text-gray-900 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
